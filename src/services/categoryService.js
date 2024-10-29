import { supabase } from "@/utils/supabase";

/**
 * Creates a new category in the database.
 * @param {Object} categoryData - The data for the new category.
 * @returns {Object} The created category data.
 * @throws Will throw an error if the category creation fails.
 */
export const createCategory = async (categoryData) => {
  const { data, error } = await supabase
    .from("categories")
    .insert([categoryData])
    .select("*");
  if (error) throw error;
  console.log("Category created:", data);
  return data;
};

/**
 * Fetches all categories for a specific user, including the count of decks in each category.
 * Also includes an "Uncategorised" category for decks without a category.
 * @param {string} userId - The ID of the user.
 * @returns {Array} An array of categories with deck counts.
 */
export const getCategoriesByUser = async (userId) => {
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      decks:decks!left (
        id,
        category_id
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  // Process the data to include the decks count
  const processedData = data.map((category) => ({
    ...category,
    decks_count: category.decks.length,
  }));

  console.log("Categories fetched:", processedData);

  // Fetch all decks belonging to the user
  const { data: decksData, error: decksError } = await supabase
    .from("decks")
    .select("id, category_id")
    .eq("user_id", userId);

  if (decksError) {
    console.error("Error fetching decks:", decksError);
    return processedData;
  }

  // Find uncategorized decks (decks with no associated category)
  const uncategorizedDecks = decksData.filter(
    (deck) => deck.category_id === null
  );

  // Add the "Uncategorized" category manually if there are uncategorized decks
  if (uncategorizedDecks.length > 0) {
    processedData.push({
      id: 0, // Assign a unique ID for the uncategorized category
      name: "Uncategorised", // Display name
      decks_count: uncategorizedDecks.length, // Number of uncategorized decks
      decks: uncategorizedDecks, // The actual uncategorized decks
    });
  }

  return processedData;
};

/**
 * Fetches a category by its ID.
 * @param {string} categoryId - The ID of the category.
 * @returns {Object} The category data.
 * @throws Will throw an error if the category fetch fails.
 */
export const getCategoryById = async (categoryId) => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .single();
  if (error) throw error;
  return data;
};

/**
 * Updates a category with new data.
 * @param {string} categoryId - The ID of the category to update.
 * @param {Object} categoryData - The new data for the category.
 * @param {string} userId - The ID of the user.
 * @returns {Object} The updated category data.
 * @throws Will throw an error if the category update fails.
 */
export const updateCategory = async (categoryId, categoryData, userId) => {
  console.log("Updating category:", categoryId);
  console.log("New data:", categoryData);
  const { data, error } = await supabase
    .from("categories")
    .update({ ...categoryData })
    .eq("user_id", userId)
    .eq("id", categoryId)
    .select();
  if (error) throw error;

  console.log("Category updated:", data);
  return { data, error };
};

/**
 * Deletes a category and updates associated decks to be uncategorized.
 * @param {string} categoryId - The ID of the category to delete.
 * @param {string} userId - The ID of the user.
 * @returns {Object} An object containing any error that occurred.
 * @throws Will throw an error if the category deletion or deck update fails.
 */
export const deleteCategory = async (categoryId, userId) => {
  // Update decks with this category id to be "uncategorised"
  const { error: updateError } = await supabase
    .from("decks")
    .update({ category_id: null })
    .eq("category_id", categoryId)
    .eq("user_id", userId);
  if (updateError) throw updateError;

  // Delete the category
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)
    .eq("user_id", userId);
  if (error) throw error;
  console.log("Category deleted:", categoryId);

  return { error };
};
