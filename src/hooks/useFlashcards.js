import { useState, useEffect, useCallback } from "react";
import { getFlashcardsByDeck } from "@/services/flashcardService";

const useFlashcards = (deckId) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFlashcards = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFlashcardsByDeck(deckId);
      setFlashcards(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  return { flashcards, loading, error, refresh: fetchFlashcards };
};

export default useFlashcards;
