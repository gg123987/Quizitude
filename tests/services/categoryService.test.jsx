import {
  createCategory,
  getCategoriesByUser,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/services/categoryService";
import { describe, it, expect, vi } from "vitest";

describe("Category Service", () => {
  const userId = "test-user-id";
  const categoryData = { name: "New Category", user_id: userId };

  beforeEach(() => {
    vi.clearAllMocks(); // Clear any previous mock data
  });

  test("createCategory should create a category and return data", async () => {
    const result = await createCategory(categoryData);
    expect(result).toEqual([{ id: 1, ...categoryData }]);
  });

  test("getCategoriesByUser should fetch categories and decks count", async () => {
    const result = await getCategoriesByUser(userId);
    expect(result).toEqual([
      {
        id: 1,
        name: "Category 1",
        user_id: userId,
        decks_count: 1,
        decks: [],
      },
      { id: 2, name: "Category 2", user_id: userId, decks_count: 0, decks: [] },
      {
        id: 0,
        name: "Uncategorised",
        decks_count: 0,
        decks: [],
      },
    ]);
  });

  test("getCategoryById should fetch a category by its ID", async () => {
    const result = await getCategoryById(1);
    expect(result).toEqual({ id: 1, name: "Category 1" });
  });

  test("updateCategory should update a category and return the updated data", async () => {
    const updatedData = { name: "Updated Category" };
    const result = await updateCategory(1, updatedData, userId);
    expect(result).toEqual({
      data: [{ id: 1, name: "Updated Category" }],
      error: null,
    });
  });

  test("deleteCategory should delete a category and update decks", async () => {
    const result = await deleteCategory(1, userId);
    expect(result).toEqual({ error: null });
  });
});
