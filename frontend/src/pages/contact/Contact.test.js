// src/pages/contact/Contact.test.js

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import Contact from "./Contact";
import axios from "axios";
import { toast } from "react-toastify";

// Mock necessary modules and services
jest.mock("axios");
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
        <Contact />
      </BrowserRouter>
    </Provider>
  );
};

describe("Contact Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Contact form and contact information", () => {
    renderComponent();
    
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
    expect(screen.getByText(/+1 222 333 4567/i)).toBeInTheDocument();
    expect(screen.getByText(/support@alphawave.com/i)).toBeInTheDocument();
    expect(screen.getByText(/windsor, ontario/i)).toBeInTheDocument();
    expect(screen.getByText(/@alphawave/i)).toBeInTheDocument();
  });

  test("handles input changes", () => {
    renderComponent();
    
    const subjectInput = screen.getByLabelText(/subject/i);
    const messageInput = screen.getByLabelText(/message/i);

    fireEvent.change(subjectInput, { target: { value: "Test Subject" } });
    fireEvent.change(messageInput, { target: { value: "Test Message" } });

    expect(subjectInput).toHaveValue("Test Subject");
    expect(messageInput).toHaveValue("Test Message");
  });

  test("submits form and shows success toast", async () => {
    axios.post.mockResolvedValueOnce({ data: { message: "Message sent successfully!" } });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: "Test Subject" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Test Message" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(${process.env.REACT_APP_BACKEND_URL}/api/contactus, {
        subject: "Test Subject",
        message: "Test Message",
      });
      expect(toast.success).toHaveBeenCalledWith("Message sent successfully!");
    });
  });

  test("shows error toast if submission fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("Failed to send message"));

    renderComponent();

    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: "Test Subject" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Test Message" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to send message");
    });
  });
});