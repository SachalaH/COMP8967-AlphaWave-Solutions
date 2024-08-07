// src/pages/auth/Login.test.js

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import Login from "./Login";
import * as authService from "../../services/authService";
import * as authSlice from "../../redux/features/auth/authSlice";

// Mock necessary modules and services
jest.mock("../../services/authService");
jest.mock("../../redux/features/auth/authSlice", () => ({
  SET_LOGIN: jest.fn(),
  SET_NAME: jest.fn(),
}));

const mockStore = configureStore([thunk]);

const renderComponent = (store) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
};

describe("Login Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  test("renders email and password inputs and login button", () => {
    renderComponent(store);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("updates email and password fields on change", () => {
    renderComponent(store);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("shows error toast when fields are empty", () => {
    renderComponent(store);

    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.click(loginButton);

    expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
  });

  test("shows error toast with invalid email", () => {
    authService.validateEmail.mockReturnValue(false);

    renderComponent(store);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  });

  test("calls loginUser and dispatches actions on successful login", async () => {
    authService.loginUser.mockResolvedValue({ name: "Test User" });

    renderComponent(store);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    expect(authService.loginUser).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(authSlice.SET_LOGIN).toHaveBeenCalledWith(true);
    expect(authSlice.SET_NAME).toHaveBeenCalledWith("Test User");
  });

  test("shows Loader while logging in", async () => {
    authService.loginUser.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    renderComponent(store);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });
});
