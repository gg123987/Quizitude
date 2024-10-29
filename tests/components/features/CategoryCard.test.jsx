import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import Category from "@/components/features/CategoryCard/Category";
import { vi } from "vitest";
import { useNavigate } from "react-router-dom";
import { updateCategory, deleteCategory } from "@/services/categoryService";

// Mock the useNavigate hook to prevent actual navigation in tests
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: vi.fn(),
}));

// Mock the category service functions
vi.mock("@/services/categoryService", () => ({
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

describe("Category Component", () => {
  const mockCategory = {
    id: 1,
    name: "Sample Category",
    decks_count: 3,
  };
  const mockRefreshCategories = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(vi.fn()); // Reset navigate mock before each test
  });

  it("renders category name and deck count correctly", () => {
    render(
      <Category
        category={mockCategory}
        onRefreshCategories={mockRefreshCategories}
      />
    );

    expect(screen.getByText("Sample Category")).toBeInTheDocument();

    const deckCountContainer = screen.getByText("3").closest("div");
    within(deckCountContainer).getByText(/Decks?/);
  });

  it("navigates to category's deck page on click", () => {
    const navigateMock = vi.fn();
    useNavigate.mockReturnValue(navigateMock);

    render(
      <Category
        category={mockCategory}
        onRefreshCategories={mockRefreshCategories}
      />
    );
    fireEvent.click(screen.getByText("Sample Category"));

    expect(navigateMock).toHaveBeenCalledWith(
      "/decks?categoryId=1&categoryName=Sample+Category"
    );
  });

  it("opens the rename dialog and renames the category", async () => {
    // Set up mock implementation for updateCategory to resolve successfully
    updateCategory.mockResolvedValueOnce({ data: { success: true } });

    render(
      <Category
        category={mockCategory}
        onRefreshCategories={mockRefreshCategories}
      />
    );

    // Open menu and select "Rename"
    fireEvent.click(screen.getByLabelText("category-menu"));
    fireEvent.click(screen.getByText("Rename"));

    // Check if rename dialog opens
    const renameInput = screen.getByLabelText("New Category Name");
    expect(renameInput).toBeInTheDocument();

    // Enter a new name and submit
    fireEvent.change(renameInput, { target: { value: "Updated Category" } });
    fireEvent.click(screen.getByText("Save"));

    // Wait for updateCategory to be called and check mockRefreshCategories call
    await waitFor(() => {
      expect(updateCategory).toHaveBeenCalledWith(
        1,
        { name: "Updated Category" },
        undefined
      );
      expect(mockRefreshCategories).toHaveBeenCalled();
    });
  });

  it("opens the delete dialog and deletes the category", async () => {
    // Define the behavior of the deleteCategory mock
    deleteCategory.mockResolvedValue({ error: null }); // Mock successful deletion response

    const { getByLabelText, getByText } = render(
      <Category
        category={{ id: 1, user_id: 2, name: "Sample Category" }}
        onRefreshCategories={mockRefreshCategories}
      />
    );

    // Simulate user opening the delete dialog
    fireEvent.click(getByLabelText("category-menu"));

    // Click the delete option in the menu
    fireEvent.click(getByText("Delete"));

    // Confirm deletion in the dialog
    // Use getAllByText and specify the context to find the correct button
    const deleteButtons = await screen.findAllByText("Delete");
    const confirmDeleteButton = deleteButtons[1]; // Get the second "Delete" button, which is the confirmation button
    fireEvent.click(confirmDeleteButton);

    // Wait for the expectations
    await waitFor(() => {
      expect(deleteCategory).toHaveBeenCalledWith(1, 2); // Check if deleteCategory was called with the correct parameters
      expect(mockRefreshCategories).toHaveBeenCalled(); // Ensure refreshCategories was called
    });
  });
});
