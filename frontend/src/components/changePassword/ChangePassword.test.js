// src/components/changePassword/ChangePassword.test.js

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import ChangePassword from "./ChangePassword";
import { changePassword } from "../../services/authService";
import { toast } from "react-toastify";

// Mock necessary modules and services
jest.mock("../../services/authService");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockStore = configureStore([thunk]);

const renderComponent = (store) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ChangePassword />
      </BrowserRouter>
    </Provider>
  );
};

describe("ChangePassword Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Change Password form", () => {
    renderComponent();

    expect(screen.getByPlaceholderText(/old password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/new password/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm new password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /change password/i })
    ).toBeInTheDocument();
  });

  test("handles input changes", () => {
    renderComponent();

    const oldPasswordInput = screen.getByPlaceholderText(/old password/i);
    const newPasswordInput = screen.getByPlaceholderText(/new password/i);
    const confirmPasswordInput =
      screen.getByPlaceholderText(/confirm new password/i);

    fireEvent.change(oldPasswordInput, { target: { value: "oldPass123" } });
    fireEvent.change(newPasswordInput, { target: { value: "newPass123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "newPass123" } });

    expect(oldPasswordInput).toHaveValue("oldPass123");
    expect(newPasswordInput).toHaveValue("newPass123");
    expect(confirmPasswordInput).toHaveValue("newPass123");
  });

  test("shows error if new passwords do not match", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/old password/i), {
      target: { value: "oldPass123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/new password/i), {
      target: { value: "newPass123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: "differentPass123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("New passwords do not match");
    });
  });

  test("submits form and shows success toast", async () => {
    changePassword.mockResolvedValueOnce("Password changed successfully");

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/old password/i), {
      target: { value: "oldPass123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/new password/i), {
      target: { value: "newPass123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: "newPass123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));

    await waitFor(() => {
      expect(changePassword).toHaveBeenCalledWith({
        oldPassword: "oldPass123",
        password: "newPass123",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Password changed successfully"
      );
    });
  });

  test("shows error toast if change password fails", async () => {
    changePassword.mockRejectedValueOnce(
      new Error("Failed to change password")
    );

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/old password/i), {
      target: { value: "oldPass123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/new password/i), {
      target: { value: "newPass123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: "newPass123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to change password");
    });
  });
});
