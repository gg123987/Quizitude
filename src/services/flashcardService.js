import { supabase } from '@/utils/supabase';

export const createFlashcard = async (flashcardData) => {
  const { data, error } = await supabase.from('flashcards').insert([flashcardData]);
  if (error) throw error;
  return data;
};

export const getFlashcardsByDeck = async (deckId) => {
  const { data, error } = await supabase.from('flashcards').select('*').eq('deck_id', deckId);
  if (error) throw error;
  return data;
};

export const updateFlashcard = async (flashcardId, flashcardData) => {
  const { data, error } = await supabase.from('flashcards').update(flashcardData).eq('id', flashcardId);
  if (error) throw error;
  return data;
};

export const deleteFlashcard = async (flashcardId) => {
  const { data, error } = await supabase.from('flashcards').delete().eq('id', flashcardId);
  if (error) throw error;
  return data;
};

// Function to insert dummy flashcards into a deck
export const insertDummyFlashcards = async (deckId) => {
  const dummyFlashcards = [
    { question: 'What is the capital of France?', answer: 'Paris', deck_id: deckId, type: 'SA' },
    { question: 'What is 2 + 2?', answer: '4', deck_id: deckId, type: 'SA' },
    { question: 'What is the chemical symbol for water?', answer: 'H2O', deck_id: deckId, type: 'SA' },
    { question: 'What is the largest mammal?', answer: 'Blue whale', deck_id: deckId, type: 'SA' },
    { question: 'What is the tallest mountain in the world?', answer: 'Mount Everest', deck_id: deckId, type: 'SA' },
    { question: 'What is the largest planet in our solar system?', answer: 'Jupiter', deck_id: deckId, type: 'SA' },
  ];

  const { data, error } = await supabase.from('flashcards').insert(dummyFlashcards);
  if (error) throw error;
  return data;
};

//function to insert an array of flashcards into a deck
export const insertFlashcards = async (flashcards) => {
  const { data, error } = await supabase.from('flashcards').insert(flashcards);
  if (error) throw error;
  return data;
};


//function to format the flashcard data to be inserted into the database
//this function takes in an array of flashcards and a deckId and returns 
//an array of flashcard objects in the correct format for the database
//the function must return an array of flashcard objects. 
//it must also include a field for 'options' ONLY if the flashcard is a multiple choice question
//the 'options' field should be an array of strings
export const formatAndInsertFlashcardData = async (flashcards, deckId) => {
  let thisType;
  if (flashcards[0].choices) {
    thisType = 'MC';
  } else {
    thisType = 'SA';
  }
  const flashcardArray = flashcards.map(flashcard => {
    return {
      question: flashcard.question,
      answer: flashcard.answer,
      deck_id: deckId,
      type: thisType,
      // Add options field only if the flashcard is a multiple choice question, else it should not set it
      options: flashcard.choices || null
    };
  });
  const { data, error } = await supabase.from('flashcards').insert(flashcardArray);
  if (error) throw error;
  return data;
};

