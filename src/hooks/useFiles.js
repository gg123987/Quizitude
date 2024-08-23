import { useState, useEffect } from 'react';
import { getFilesByDeck } from '@/services/fileService';

const useFiles = (deckId) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getFilesByDeck(deckId);
        setFiles(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [deckId]);

  return { files, loading, error };
};

export default useFiles;