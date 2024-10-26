import { supabase } from "@/utils/supabase";

export const createDeck = async (deckData) => {
  const { data, error } = await supabase
    .from("decks")
    .insert([deckData])
    .select("*");
  if (error) throw error;

  console.log("Deck created:", data);
  return data;
};

export const getDecksByUser = async (userId) => {
  const { data, error } = await supabase
    .from("decks")
    .select(
      `
      *,
      categories:categories!decks_category_id_fkey (
        id,
        name
      ),
      flashcards (
        id
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching decks:", error);
    return [];
  }

  // Process the data to include the flashcards count
  const processedData = data.map((deck) => ({
    ...deck,
    categories: deck.categories || { id: 0, name: "Uncategorised" },
    flashcards_count: deck.flashcards.length,
  }));

  return processedData;
};

export const getDeckById = async (deckId) => {
  const { data, error } = await supabase
    .from("decks")
    .select(
      `
      *,
      categories:categories!decks_category_id_fkey (
        id,
        name
      ),
      flashcards (
        id
      )
    `
    )
    .eq("id", deckId)
    .single();

  if (error) {
    console.error("Error fetching deck:", error);
    return null;
  }

  // Process the data to include the flashcards count
  const processedData = {
    ...data,
    categories: data.categories || { id: 0, name: "Uncategorised" },
    flashcards_count: data.flashcards.length,
  };

  return processedData;
};

export const updateDeck = async (deckId, deckData, userId) => {
  console.log("Updating deck:", deckId);
  console.log("New data:", deckData);
  const { data, error } = await supabase
    .from("decks")
    .update({ ...deckData })
    .eq("user_id", userId)
    .eq("id", deckId)
    .select();
  if (error) throw error;

  console.log("Deck updated:", data);
  return { data, error };
};

export const deleteDeck = async (deckId) => {
  const { data, error } = await supabase
    .from("decks")
    .delete()
    .eq("id", deckId);
  if (error) throw error;
  return data;
};
