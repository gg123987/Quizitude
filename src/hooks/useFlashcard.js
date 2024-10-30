import { useState, useEffect } from "react";
import { getFlashcardById } from "@/services/flashcardService";

const useFlashcard = (flashcardId) => {
  const [flashcard, setFlashcard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlashcard = async () => {
      try {
        const data = await getFlashcardById(flashcardId);
        setFlashcard(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcard();
  }, [flashcardId]);

  return { flashcard, loading, error };
};

export default useFlashcard;
