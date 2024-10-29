import { supabase } from "@/utils/supabase";

/**
 * Logs in a user with the provided email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - The user data or an error object.
 */
export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Login error:", error.message);
    return { error };
  }
};

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  try {
    localStorage.removeItem("rememberMeToken");
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Sign out error:", error.message);
  }
};

/**
 * Sends a password reset email to the provided email address.
 * @param {string} email - The user's email address.
 * @returns {Promise<Object>} - An error object if there was an error.
 */
export const passwordReset = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/update-password",
    });
    return { error };
  } catch (error) {
    console.error("Password reset error:", error.message);
    return { error };
  }
};

/**
 * Updates the user's password.
 * @param {string} updatedPassword - The new password.
 * @returns {Promise<Object>} - An error object if there was an error.
 */
export const updatePassword = async (updatedPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: updatedPassword,
    });
    return { error };
  } catch (error) {
    console.error("Update password error:", error.message);
    return { error };
  }
};

/**
 * Signs in a user with Google OAuth.
 * @returns {Promise<void>}
 */
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) throw error;
    console.log("Google sign-in data:", data);
  } catch (error) {
    console.error("Google sign-in error:", error.message);
  }
};

/**
 * Registers a new user with the provided email, password, and name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} name - The user's name.
 * @returns {Promise<Object>} - The user data or an error object.
 */
export const register = async (email, password, name) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      data: { name },
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Sign-up error:", error.message);
    return { error };
  }
};
