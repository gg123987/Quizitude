import { useState, useEffect } from 'react';
import { getUserById } from '@/services/userService';

const useFetchUser = (userId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUserById(userId);
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  return { data, loading, error };
};

export default useFetchUser;