import { useState, useEffect } from 'react';
import { getFlashcardsByDeck } from '@/services/flashcardService';

const useFlashcards = (deckId) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const data = await getFlashcardsByDeck(deckId);
        setFlashcards(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [deckId]);

  return { flashcards, loading, error };
};

export default useFlashcards;