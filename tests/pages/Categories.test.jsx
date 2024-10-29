import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Categories from "@/pages/Categories/Categories";
import useCategories from "@/hooks/useCategories";
import { createCategory } from "@/services/categoryService";
import useModal from "@/hooks/useModal";
import { useOutletContext } from "react-router-dom";

// Mock the hooks used in Categories
vi.mock("@/hooks/useCategories");
vi.mock("@/hooks/useModal");
vi.mock("@/services/categoryService");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: vi.fn(), // Mock useOutletContext
  };
});

// Mock the modal component for new category
vi.mock("@/components/features/NewCategory/NewCatModal", () => {
  return {
    default: function MockNewCategory({ open, onClose, onSave }) {
      return open ? (
        <div>
          <input placeholder="Category Name" data-testid="category-input" />
          <button
            data-testid="save-button"
            onClick={() => {
              onSave("New Category");
              onClose();
            }}
          >
            Save
          </button>
          <button data-testid="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      ) : null;
    },
  };
});

describe("Categories Component", () => {
  const mockCategories = [
    {
      id: "1",
      name: "Category 1",
      created_at: "2023-01-01",
      updated_at: "2023-01-02",
    },
    {
      id: "2",
      name: "Category 2",
      created_at: "2023-01-02",
      updated_at: "2023-01-03",
    },
  ];

  // Set up the userId to return from the mock useOutletContext
  const mockUserId = "12345"; // Replace with your expected user ID

  beforeEach(() => {
    // Set up the default mock return values for useCategories
    useCategories.mockReturnValue({
      categories: mockCategories,
      loading: false,
      error: null,
      refreshCategories: vi.fn(),
    });

    // Set up the default mock return value for useModal
    useModal.mockReturnValue({
      openModal: vi.fn(),
    });

    // Mock the return value of useOutletContext
    useOutletContext.mockReturnValue({
      userId: mockUserId,
    });
  });

  test("renders Categories component", () => {
    render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("2 categories")).toBeInTheDocument();
  });

  test("opens new category modal", () => {
    render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    // Open the modal
    fireEvent.click(screen.getByRole("button", { name: "New Category" }));

    // Check if modal input is rendered
    expect(screen.getByPlaceholderText("Category Name")).toBeInTheDocument();
  });

  test("creates a new category", async () => {
    render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    // Open the modal
    fireEvent.click(screen.getByRole("button", { name: "New Category" }));

    // Fill in the category name and save
    fireEvent.change(screen.getByTestId("category-input"), {
      target: { value: "New Category" },
    });
    fireEvent.click(screen.getByTestId("save-button"));

    // Expect the category creation function to be called
    expect(createCategory).toHaveBeenCalledWith({
      name: "New Category",
      user_id: mockUserId,
    }); // Use mockUserId here
  });

  test("clears the search input", async () => {
    render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    // Open the modal
    fireEvent.click(screen.getByRole("button", { name: "New Category" }));

    // Fill in the category name and save
    fireEvent.change(screen.getByTestId("category-input"), {
      target: { value: "New Category" },
    });
    fireEvent.click(screen.getByTestId("save-button"));

    // Clear the search input
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "Category 1" } });
    expect(screen.getByText("Category 1")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("clear-search"));
    expect(searchInput.value).toBe("");
  });

  test("handles loading state", () => {
    // Update the mock to indicate loading
    useCategories.mockReturnValue({
      categories: [],
      loading: true,
      error: null,
      refreshCategories: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("displays error message when there is an error", () => {
    // Update the mock to indicate an error
    useCategories.mockReturnValue({
      categories: [],
      loading: false,
      error: { message: "Failed to load categories" },
      refreshCategories: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    expect(screen.getByText("Failed to load categories")).toBeInTheDocument();
  });
});
