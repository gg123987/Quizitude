import { useState, useEffect, useCallback } from "react";
import { getCategoriesByUser } from "@/services/categoryService";

const useCategories = (userId) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategoriesByUser(userId);
      setCategories(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, userId]);

  const refreshCategories = () => {
    setLoading(true);
    fetchCategories();
  };

  return { categories, loading, error, refreshCategories };
};

export default useCategories;
