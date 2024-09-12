import { useState, useEffect } from "react";
import { getCategoryById } from "@/services/categoryService";

const useCategory = (categoryId) => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategoryById(categoryId);
        setCategory(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [categoryId]);

  return { category, loading, error };
};

export default useCategory;
