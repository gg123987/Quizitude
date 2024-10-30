import { useState, useEffect } from "react";
import { getFileByDeck } from "@/services/fileService";

const useFile = (deckId) => {
  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const data = await getFileByDeck(deckId);
        setFile(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, [deckId]);

  return { file, loading, error };
};

export default useFile;
