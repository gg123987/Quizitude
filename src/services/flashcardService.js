import { supabase } from "@/utils/supabase";

export const createFlashcard = async (flashcardData) => {
  const { data, error } = await supabase
    .from("flashcards")
    .insert([flashcardData]);
  if (error) throw error;
  return data;
};

export const getFlashcardsByDeck = async (deckId) => {
  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("deck_id", deckId);
  if (error) throw error;
  return data;
};

export const getFlashcardById = async (flashcardId) => {
  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("id", flashcardId);
  if (error) throw error;
  return data;
};

/**
 * Updates an existing flashcard in the database.
 * @param {number} flashcardId - The ID of the flashcard to be updated.
 * @param {Object} flashcardData - The new data for the flashcard.
 * @returns {Promise<Object>} The updated flashcard data.
 * @throws Will throw an error if the update fails.
 */
export const updateFlashcard = async (flashcardId, flashcardData) => {
  const { data, error } = await supabase
    .from("flashcards")
    .update(flashcardData)
    .eq("id", flashcardId)
    .select();
  if (error) throw error;
  return { data, error };
};

export const deleteFlashcard = async (flashcardId) => {
  const { data, error } = await supabase
    .from("flashcards")
    .delete()
    .eq("id", flashcardId);
  if (error) throw error;
  return { data, error };
};

/**
 * Inserts dummy flashcards into a specific deck for testing purposes.
 * @param {number} deckId - The ID of the deck.
 * @returns {Promise<Array>} An array of inserted dummy flashcards.
 * @throws Will throw an error if the insertion fails.
 */
export const insertDummyFlashcards = async (deckId) => {
  const dummyFlashcards = [
    {
      question: "What is the capital of France?",
      answer: "Paris",
      deck_id: deckId,
      type: "SA",
    },
    { question: "What is 2 + 2?", answer: "4", deck_id: deckId, type: "SA" },
    {
      question: "What is the chemical symbol for water?",
      answer: "H2O",
      deck_id: deckId,
      type: "SA",
    },
    {
      question: "What is the largest mammal?",
      answer: "Blue whale",
      deck_id: deckId,
      type: "SA",
    },
    {
      question: "What is the tallest mountain in the world?",
      answer: "Mount Everest",
      deck_id: deckId,
      type: "SA",
    },
    {
      question: "What is the largest planet in our solar system?",
      answer: "Jupiter",
      deck_id: deckId,
      type: "SA",
    },
  ];

  const { data, error } = await supabase
    .from("flashcards")
    .insert(dummyFlashcards);
  if (error) throw error;
  return data;
};

/**
 * Inserts an array of flashcards into the database.
 * @param {Array} flashcards - An array of flashcard objects to be inserted.
 * @returns {Promise<Array>} An array of inserted flashcards.
 * @throws Will throw an error if the insertion fails.
 */
export const insertFlashcards = async (flashcards) => {
  const { data, error } = await supabase.from("flashcards").insert(flashcards);
  if (error) throw error;
  return data;
};

/**
 * Formats and inserts flashcard data into the database.
 * This function takes in an array of flashcards and a deckId, and returns
 * an array of flashcard objects in the correct format for the database.
 * The function includes a field for 'options' ONLY if the flashcard is a multiple choice question.
 * The 'options' field should be an array of strings.
 * @param {Array} flashcards - An array of flashcard objects to be formatted and inserted.
 * @param {number} deckId - The ID of the deck.
 * @returns {Promise<Array>} An array of inserted flashcards.
 * @throws Will throw an error if the insertion fails.
 */
export const formatAndInsertFlashcardData = async (flashcards, deckId) => {
  if (!flashcards || flashcards.length === 0) {
    throw new Error("No flashcards to insert");
  }

  // Determine the type of flashcard (MC for multiple choice, SA for short answer)
  let thisType;
  if (flashcards[0].choices) {
    thisType = "MC";
  } else {
    thisType = "SA";
  }

  // Map the flashcards to the correct format for the database
  const flashcardArray = flashcards.map((flashcard) => {
    return {
      question: flashcard.question,
      answer: flashcard.answer,
      deck_id: deckId,
      type: thisType,
      // Add options field only if the flashcard is a multiple choice question, else it should not set it
      options: flashcard.choices || null,
    };
  });

  // Insert the formatted flashcards into the database
  const { data, error } = await supabase
    .from("flashcards")
    .insert(flashcardArray);
  if (error) throw error;
  return data;
};
