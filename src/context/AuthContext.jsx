import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  login,
  signOut,
  passwordReset,
  updatePassword,
  signInWithGoogle,
  register,
} from "@/services/authService";
import { supabase } from "@/utils/supabase";

// Define the context type
export const AuthContext = createContext({
  auth: false,
  user: null,
  userDetails: null,
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
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Fetches the current user and their details from Supabase.
     */
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const { user: currentUser } = data;

        if (currentUser) {
          setUser(currentUser);

          // Fetch additional data from the `users` table based on the user's ID
          const { data: userProfile, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", currentUser.id)
            .single();
          if (error) throw error;

          setUserDetails(userProfile);
        } else {
          setUser(null);
          setUserDetails(null);
        }
      } catch (error) {
        console.error("Error getting user or user details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    /**
     * Retrieves session data from local storage and sets the authentication state.
     */
    const getSessionData = async () => {
      try {
        const token = localStorage.getItem("rememberMeToken");
        if (token) {
          const { data: sessionData, error } = await supabase.auth.getSession();
          if (error) throw error;
          if (sessionData) {
            setAuth(true);
            setUser(sessionData.user);
          }
        }
      } catch (error) {
        console.error("Error getting session data:", error.message);
      }
    };

    getSessionData();
    getUser();

    /**
     * Sets up an authentication state change listener.
     */
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          setAuth(true);
          setUser(session.user);

          // Fetch additional user data after signing in
          supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()
            .then(({ data, error }) => {
              if (error)
                console.error("Error fetching user details:", error.message);
              setUserDetails(data);
            });
        } else if (event === "SIGNED_OUT") {
          setAuth(false);
          setUser(null);
        }
      }
    );

    // Cleanup the listener on component unmount
    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        user,
        userDetails,
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
