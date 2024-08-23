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