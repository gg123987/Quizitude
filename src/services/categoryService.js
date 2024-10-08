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
      decks:decks!inner (
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
