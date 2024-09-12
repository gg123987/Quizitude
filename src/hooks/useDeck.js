import { useState, useEffect } from 'react';
import { getDeckById } from '@/services/deckService';

const useDeck = (deckId) => {
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const data = await getDeckById(deckId);
        setDeck(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeck();
  }, [deckId]);

  return { deck, loading, error };
};

export default useDeck;