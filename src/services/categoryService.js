import { supabase } from '@/utils/supabase';

export const createCategory = async (categoryData) => {
  const { data, error } = await supabase.from('categories').insert([categoryData]).select("*");
  if (error) throw error;
  console.log("Category created:", data);
  return data;
};

export const getCategoriesByUser = async (userId) => {
  const { data, error } = await supabase.from('categories').select('*').eq('user_id', userId);
  if (error) throw error;
  return data;
};