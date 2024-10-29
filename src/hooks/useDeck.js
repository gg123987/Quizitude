import { useState, useEffect, useCallback } from "react";
import { getDeckById } from "@/services/deckService";

const useDeck = (deckId) => {
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeck = useCallback(async () => {
    if (!deckId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getDeckById(deckId);
      setDeck(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    fetchDeck();
  }, [fetchDeck]);

  return { deck, loading, error, refreshDeck: fetchDeck };
};

export default useDeck;
