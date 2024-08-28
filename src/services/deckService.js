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
    .from('decks')
    .select(`
      id,
      name,
      created_at,
      updated_at,
      is_favourite,
      is_reviewed,
      categories:categories!decks_category_id_fkey (
        id,
        name
      ),
      flashcards (
        id
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching decks:', error);
    return [];
  }

  // Process the data to include the flashcards count
  const processedData = data.map(deck => ({
    ...deck,
    categories: deck.categories || { id: 0, name: 'Uncategorised' },
    flashcards_count: deck.flashcards.length
  }));

  return processedData;
};

export const updateDeck = async (deckId, deckData) => {
  const { data, error } = await supabase
    .from("decks")
    .update(deckData)
    .eq("id", deckId);
  if (error) throw error;
  return data;
};

export const deleteDeck = async (deckId) => {
  const { data, error } = await supabase
    .from("decks")
    .delete()
    .eq("id", deckId);
  if (error) throw error;
  return data;
};
