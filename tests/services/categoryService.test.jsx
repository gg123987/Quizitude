import {
  createCategory,
  getCategoriesByUser,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/services/categoryService";
import { describe, it, expect, vi } from "vitest";
import { supabase } from "@/utils/supabase";

// Mock the supabase client
vi.mock("@/utils/supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("Category Service", () => {
  const userId = "test-user-id";
  const categoryData = { name: "New Category", user_id: userId };

  beforeEach(() => {
    vi.clearAllMocks(); // Clear any previous mock data
  });

  it("createCategory should create a category and return data", async () => {
    // Mock the response for successful insert
    const mockResponse = {
      data: [{ id: 1, ...categoryData }],
      error: null,
    };

    // Mock the method chaining for successful creation
    supabase.from.mockReturnValueOnce({
      insert: vi.fn().mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce(mockResponse),
      }),
    });

    const result = await createCategory(categoryData);
    expect(result).toEqual([{ id: 1, ...categoryData }]);
    expect(supabase.from).toHaveBeenCalledWith("categories");
  });

  it("getCategoriesByUser should fetch categories and decks count", async () => {
    // Mock the response for fetching categories
    const mockCategoriesResponse = {
      data: [
        {
          id: 1,
          name: "Category 1",
          user_id: "test-user-id",
          decks: [{ id: 2, category_id: 1 }], // Decks associated with Category 1
        },
      ],
      error: null,
    };

    // Mock the method chaining for fetching categories
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockResolvedValueOnce(mockCategoriesResponse),
      }),
    });

    // Mock the response for fetching decks
    const mockDecksResponse = {
      data: [{ id: 2, category_id: 1 }], // Decks associated with Category 1
      error: null,
    };

    // Mock the method chaining for fetching decks
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockResolvedValueOnce(mockDecksResponse),
      }),
    });

    const result = await getCategoriesByUser(userId);

    // Here we expect decks_count to reflect the actual decks returned
    expect(result).toEqual([
      {
        id: 1,
        name: "Category 1",
        user_id: "test-user-id",
        decks_count: 1,
        decks: mockDecksResponse.data,
      },
    ]);

    expect(supabase.from).toHaveBeenCalledWith("categories");
    expect(supabase.from).toHaveBeenCalledWith("decks");
  });

  it("getCategoryById should fetch a category by its ID", async () => {
    // Mock the response for fetching a category
    const mockResponse = {
      data: { id: 1, name: "Category 1" },
      error: null,
    };

    // Mock the method chaining for fetching a category
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getCategoryById(1);
    expect(result).toEqual({ id: 1, name: "Category 1" });
    expect(supabase.from).toHaveBeenCalledWith("categories");
  });

  it("updateCategory should update a category and return the updated data", async () => {
    // Mock the response for successful update
    const mockResponse = {
      data: [{ id: 1, name: "Updated Category" }],
      error: null,
    };

    // Mock the method chaining for successful update
    supabase.from.mockReturnValueOnce({
      update: vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            select: vi.fn().mockResolvedValueOnce(mockResponse),
          }),
        }),
      }),
    });

    const updatedData = { name: "Updated Category" };
    const result = await updateCategory(1, updatedData, userId);
    expect(result).toEqual({
      data: [{ id: 1, name: "Updated Category" }],
      error: null,
    });
    expect(supabase.from).toHaveBeenCalledWith("categories");
  });

  it("deleteCategory should delete a category and update decks", async () => {
    // Mock the response for successful deck update
    const mockUpdateResponse = {
      error: null,
    };

    // Mock the method chaining for successful deck update
    supabase.from.mockReturnValueOnce({
      update: vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            select: vi.fn().mockResolvedValueOnce(mockUpdateResponse),
          }),
        }),
      }),
    });

    // Now, mock the delete operation for categories
    const mockDeleteResponse = {
      error: null,
    };

    // Mock the method chaining for successful category deletion
    supabase.from.mockReturnValueOnce({
      delete: vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockResolvedValueOnce(mockDeleteResponse),
        }),
      }),
    });

    // Call the deleteCategory function
    const result = await deleteCategory(1, userId);

    // Check that the result is as expected
    expect(result).toEqual({ error: null });

    // Check that supabase was called with the correct table names
    expect(supabase.from).toHaveBeenCalledWith("decks");
    expect(supabase.from).toHaveBeenCalledWith("categories");
  });
});
