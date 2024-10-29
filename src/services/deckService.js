import { supabase } from "@/utils/supabase";

/**
 * Creates a new deck in the database.
 * @param {Object} deckData - The data of the deck to be created.
 * @returns {Object} The created deck data.
 * @throws Will throw an error if the deck creation fails.
 */
export const createDeck = async (deckData) => {
  const { data, error } = await supabase
    .from("decks")
    .insert([deckData])
    .select("*");
  if (error) throw error;

  console.log("Deck created:", data);
  return data;
};

/**
 * Fetches all decks for a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Array} An array of decks with their categories and flashcards count.
 */
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

  // Process the data to include the flashcards count and the deck category
  const processedData = data.map((deck) => ({
    ...deck,
    categories: deck.categories || { id: 0, name: "Uncategorised" },
    flashcards_count: deck.flashcards.length,
  }));

  return processedData;
};

/**
 * Fetches a specific deck by its ID.
 * @param {string} deckId - The ID of the deck.
 * @returns {Object|null} The deck data with its categories and flashcards count, or null if not found.
 */
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

  // Process the data to include the flashcards count and the deck category
  const processedData = {
    ...data,
    categories: data.categories || { id: 0, name: "Uncategorised" },
    flashcards_count: data.flashcards.length,
  };

  return processedData;
};

/**
 * Updates a specific deck by its ID.
 * @param {string} deckId - The ID of the deck to be updated.
 * @param {Object} deckData - The new data for the deck.
 * @param {string} userId - The ID of the user who owns the deck.
 * @returns {Object} The updated deck data.
 * @throws Will throw an error if the deck update fails.
 */
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

/**
 * Deletes a specific deck by its ID.
 * @param {string} deckId - The ID of the deck to be deleted.
 * @returns {Object} The data of the deleted deck.
 * @throws Will throw an error if the deck deletion fails.
 */
export const deleteDeck = async (deckId) => {
  const { data, error } = await supabase
    .from("decks")
    .delete()
    .eq("id", deckId);
  if (error) throw error;
  return data;
};
