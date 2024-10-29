import { useState, useEffect, useCallback } from "react";
import { getFilesByUser } from "@/services/fileService";

const useFiles = (userId) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFilesByUser(userId);
      setFiles(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { files, loading, error, refetch: fetchFiles };
};

export default useFiles;
