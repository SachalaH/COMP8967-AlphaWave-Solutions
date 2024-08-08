// src/pages/products/AddProduct.test.js

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import AddProduct from "./AddProduct";
import * as productSlice from "../../redux/features/product/productSlice";
import ProductForm from "../../components/product/productForm/ProductForm";

// Mock necessary modules and services
jest.mock("../../redux/features/product/productSlice", () => ({
  createProduct: jest.fn(),
  selectIsLoading: jest.fn(),
}));

jest.mock("../../components/product/productForm/ProductForm", () =>
  jest.fn(() => <div>Mocked Product Form</div>)
);

const mockStore = configureStore([thunk]);

const renderComponent = (store) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <AddProduct />
      </BrowserRouter>
    </Provider>
  );
};

describe("AddProduct Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  test("renders Add New Product heading", () => {
    renderComponent(store);
    expect(screen.getByText(/add new product/i)).toBeInTheDocument();
  });

  test("displays loader when isLoading is true", () => {
    productSlice.selectIsLoading.mockReturnValue(true);
    renderComponent(store);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  test("calls handleInputChange on input change", () => {
    renderComponent(store);

    const nameInput = screen.getByPlaceholderText("Product Name");

    fireEvent.change(nameInput, { target: { value: "New Product" } });

    expect(nameInput.value).toBe("New Product");
  });

  test("calls handleImageChange on image upload", () => {
    renderComponent(store);

    const imageInput = screen.getByTestId("image-upload");

    const file = new File(["product-image"], "product.png", {
      type: "image/png",
    });
    fireEvent.change(imageInput, { target: { files: [file] } });

    expect(imageInput.files[0]).toBe(file);
  });

  test("calls saveProduct on form submit", () => {
    renderComponent(store);

    const saveButton = screen.getByRole("button", { name: /save product/i });

    fireEvent.click(saveButton);

    expect(productSlice.createProduct).toHaveBeenCalled();
  });

  test("navigates to dashboard on successful product creation", async () => {
    productSlice.createProduct.mockResolvedValue({});
    renderComponent(store);

    const saveButton = screen.getByRole("button", { name: /save product/i });

    fireEvent.click(saveButton);

    expect(productSlice.createProduct).toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenCalledWith(expect.any(Function));
  });
});
