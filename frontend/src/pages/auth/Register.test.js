// src/pages/auth/Register.test.js

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import Register from "./Register";
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
        <Register />
      </BrowserRouter>
    </Provider>
  );
};

describe("Register Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  test("renders name, email, password, confirm password inputs and register button", () => {
    renderComponent(store);

    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  test("updates fields on change", () => {
    renderComponent(store);

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });

    expect(nameInput.value).toBe("John Doe");
    expect(emailInput.value).toBe("john@example.com");
    expect(passwordInput.value).toBe("password123");
    expect(confirmPasswordInput.value).toBe("password123");
  });

  test("shows error toast when fields are empty", () => {
    renderComponent(store);

    const registerButton = screen.getByRole("button", { name: /register/i });

    fireEvent.click(registerButton);

    expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
  });

  test("shows error toast when password is too short", () => {
    renderComponent(store);

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const registerButton = screen.getByRole("button", { name: /register/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "short" } });
    fireEvent.click(registerButton);

    expect(
      screen.getByText(/passwords must be up to 6 characters/i)
    ).toBeInTheDocument();
  });

  test("shows error toast with invalid email", () => {
    authService.validateEmail.mockReturnValue(false);

    renderComponent(store);

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const registerButton = screen.getByRole("button", { name: /register/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(registerButton);

    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  });

  test("shows error toast when passwords do not match", () => {
    renderComponent(store);

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const registerButton = screen.getByRole("button", { name: /register/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "differentpassword" },
    });
    fireEvent.click(registerButton);

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  test("calls registerUser and dispatches actions on successful registration", async () => {
    authService.registerUser.mockResolvedValue({ name: "John Doe" });

    renderComponent(store);

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const registerButton = screen.getByRole("button", { name: /register/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(registerButton);

    expect(authService.registerUser).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });
    expect(authSlice.SET_LOGIN).toHaveBeenCalledWith(true);
    expect(authSlice.SET_NAME).toHaveBeenCalledWith("John Doe");
  });

  test("shows Loader while registering", async () => {
    authService.registerUser.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    renderComponent(store);

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const registerButton = screen.getByRole("button", { name: /register/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(registerButton);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });
});
