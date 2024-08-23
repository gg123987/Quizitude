import { useState, useEffect } from 'react';
import { getDecksByUser } from '@/services/deckService';

const useDecks = (userId) => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const data = await getDecksByUser(userId);
        setDecks(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
  }, [userId]);

  return { decks, loading, error };
};

export default useDecks;