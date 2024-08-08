// src/pages/profile/EditProfile.test.js

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import EditProfile from "./EditProfile";
import * as authService from "../../services/authService";
import { toast } from "react-toastify";

// Mock necessary modules and services
jest.mock("../../services/authService", () => ({
  updateUser: jest.fn(),
}));

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
        <EditProfile />
      </BrowserRouter>
    </Provider>
  );
};

describe("EditProfile Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: {
          name: "Test User",
          email: "test@example.com",
          phone: "1234567890",
          bio: "Test Bio",
          photo: "test-photo-url",
        },
      },
    });
  });

  test("renders EditProfile form with user data", () => {
    renderComponent(store);
    expect(screen.getByLabelText(/name:/i)).toHaveValue("Test User");
    expect(screen.getByLabelText(/email:/i)).toHaveValue("test@example.com");
    expect(screen.getByLabelText(/phone:/i)).toHaveValue("1234567890");
    expect(screen.getByLabelText(/bio:/i)).toHaveValue("Test Bio");
    expect(screen.getByAltText("profilepic")).toHaveAttribute(
      "src",
      "test-photo-url"
    );
  });

  test("handles input changes", () => {
    renderComponent(store);
    const nameInput = screen.getByLabelText(/name:/i);
    fireEvent.change(nameInput, { target: { value: "Updated User" } });
    expect(nameInput).toHaveValue("Updated User");

    const phoneInput = screen.getByLabelText(/phone:/i);
    fireEvent.change(phoneInput, { target: { value: "0987654321" } });
    expect(phoneInput).toHaveValue("0987654321");

    const bioInput = screen.getByLabelText(/bio:/i);
    fireEvent.change(bioInput, { target: { value: "Updated Bio" } });
    expect(bioInput).toHaveValue("Updated Bio");
  });

  test("shows loader while updating profile", async () => {
    renderComponent(store);
    const saveButton = screen.getByRole("button", { name: /edit profile/i });

    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByTestId("loader")).toBeInTheDocument();
    });
  });

  test("calls updateUser service on form submission", async () => {
    authService.updateUser.mockResolvedValueOnce({ success: true });

    renderComponent(store);
    const saveButton = screen.getByRole("button", { name: /edit profile/i });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(authService.updateUser).toHaveBeenCalledWith({
        name: "Test User",
        phone: "1234567890",
        bio: "Test Bio",
        photo: "test-photo-url",
      });
      expect(toast.success).toHaveBeenCalledWith("User updated");
    });
  });

  test("displays error toast if update fails", async () => {
    authService.updateUser.mockRejectedValueOnce(new Error("Failed to update"));

    renderComponent(store);
    const saveButton = screen.getByRole("button", { name: /edit profile/i });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to update");
    });
  });
});
