import { supabase } from "@/utils/supabase";

export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Login error:', error.message);
    return { error };
  }
};

export const signOut = async () => {
  try {
    localStorage.removeItem("rememberMeToken");
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error.message);
  }
};

export const passwordReset = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/update-password",
    });
    return { error };
  } catch (error) {
    console.error('Password reset error:', error.message);
    return { error };
  }
};

export const updatePassword = async (updatedPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({ password: updatedPassword });
    return { error };
  } catch (error) {
    console.error('Update password error:', error.message);
    return { error };
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
    console.log('Google sign-in data:', data);
  } catch (error) {
    console.error('Google sign-in error:', error.message);
  }
};

export const register = async (email, password, name) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password, data: { name } });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Sign-up error:', error.message);
    return { error };
  }
};