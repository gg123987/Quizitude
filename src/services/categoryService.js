import { supabase } from "@/utils/supabase";

export const createCategory = async (categoryData) => {
  const { data, error } = await supabase
    .from("categories")
    .insert([categoryData])
    .select("*");
  if (error) throw error;
  console.log("Category created:", data);
  return data;
};

export const getCategoriesByUser = async (userId) => {
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      decks:decks!left (
        id
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

  return processedData;
};

export const getCategoryById = async (categoryId) => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .single();
  if (error) throw error;
  return data;
};

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
