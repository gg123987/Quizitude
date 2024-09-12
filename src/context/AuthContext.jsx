import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { login, signOut, passwordReset, updatePassword, signInWithGoogle, register } from "@/services/authService";
import { supabase } from "@/utils/supabase";

// Define the context type
export const AuthContext = createContext({
  auth: false,
  user: null,
  login: () => {},
  signOut: () => {},
  passwordReset: () => {},
  updatePassword: () => {},
  signInWithGoogle: () => {},
  register: () => {},
});

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getSession();
        setUser(currentUser ?? null);
        setAuth(!!currentUser);
      } catch (error) {
        console.error('Error getting user:', error.message);
      } finally {
        setLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setAuth(true);
        setUser(session.user);
      } else if (event === "SIGNED_OUT") {
        setAuth(false);
        setUser(null);
      }
    });

    // Call getUser to check initial session
    getUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        user,
        login,
        signOut,
        passwordReset,
        updatePassword,
        signInWithGoogle,
        register,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;