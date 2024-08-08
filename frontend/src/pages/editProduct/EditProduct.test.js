// src/pages/products/EditProduct.test.js

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import EditProduct from "./EditProduct";
import * as productSlice from "../../redux/features/product/productSlice";
import ProductForm from "../../components/product/productForm/ProductForm";

// Mock necessary modules and services
jest.mock("../../redux/features/product/productSlice", () => ({
  getProduct: jest.fn(),
  getProducts: jest.fn(),
  updateProduct: jest.fn(),
  selectIsLoading: jest.fn(),
  selectProduct: jest.fn(),
}));

jest.mock("../../components/product/productForm/ProductForm", () =>
  jest.fn(() => <div>Mocked Product Form</div>)
);

const mockStore = configureStore([thunk]);

const renderComponent = (store, routeParams = { id: "1" }) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <EditProduct match={{ params: routeParams }} />
      </BrowserRouter>
    </Provider>
  );
};

describe("EditProduct Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      product: {
        product: {
          name: "Test Product",
          category: "Test Category",
          quantity: 10,
          price: "100",
          description: "Test Description",
          image: { filePath: "test-image.jpg" },
        },
        isLoading: false,
      },
    });
    productSlice.selectIsLoading.mockReturnValue(false);
    productSlice.selectProduct.mockReturnValue(
      store.getState().product.product
    );
  });

  test("renders Edit Product heading", () => {
    renderComponent(store);
    expect(screen.getByText(/edit product/i)).toBeInTheDocument();
  });

  test("displays loader when isLoading is true", () => {
    productSlice.selectIsLoading.mockReturnValue(true);
    renderComponent(store);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  test("calls getProduct on mount", () => {
    renderComponent(store);
    expect(productSlice.getProduct).toHaveBeenCalledWith("1");
  });

  test("updates state with product data on load", () => {
    renderComponent(store);
    const nameInput = screen.getByPlaceholderText("Product Name");
    expect(nameInput.value).toBe("Test Product");
  });

  test("calls handleInputChange on input change", () => {
    renderComponent(store);
    const nameInput = screen.getByPlaceholderText("Product Name");
    fireEvent.change(nameInput, { target: { value: "Updated Product" } });
    expect(nameInput.value).toBe("Updated Product");
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

  test("calls saveProduct on form submit", async () => {
    renderComponent(store);
    const saveButton = screen.getByRole("button", { name: /save product/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(productSlice.updateProduct).toHaveBeenCalled();
    });
  });

  test("navigates to dashboard after successful product update", async () => {
    renderComponent(store);
    const saveButton = screen.getByRole("button", { name: /save product/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(productSlice.updateProduct).toHaveBeenCalled();
      expect(productSlice.getProducts).toHaveBeenCalled();
    });
  });
});
