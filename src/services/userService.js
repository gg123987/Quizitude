import { supabase } from '@/utils/supabase';

export const getUserById = async (userId) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
};

export const insertUser = async (user) => {
  const { data, error } = await supabase.from('users').insert([user]);
  if (error) throw error;
  return data;
};

export const updateUser = async (userId, userUpdates) => {
  const { data, error } = await supabase.from('users').update(userUpdates).eq('id', userId);
  if (error) throw error;
  return data;
};