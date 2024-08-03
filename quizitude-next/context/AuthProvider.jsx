import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const login = (email, password) =>
  supabase.auth.signInWithPassword({ email, password });

const signOut = () => {
  localStorage.removeItem("rememberMeToken");
  supabase.auth.signOut();
};

const passwordReset = (email) =>
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:5173/update-password",
  });

const updatePassword = (updatedPassword) =>
  supabase.auth.updateUser({ password: updatedPassword });

const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  if (error) {
    console.error('Error:', error.message)
    return
  }
  console.log(data)
};

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const { user: currentUser } = data;
      setUser(currentUser ?? null);
      setLoading(false);
    };

    const getSessionData = async () => {
      const token = localStorage.getItem('rememberMeToken');
      if (token) {
        // If token exists, try to restore session
        const { data: sessionData, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session data:", error.message);
          return;
        }
        if (sessionData) {
          setAuth(true);
          setUser(sessionData.user);}
      }
    };

    getSessionData();
    getUser();

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        setAuth(true);
        setUser(session.user);
      } else if (event === "SIGNED_OUT") {
        setAuth(false);
        setUser(null);
      }
    });
    return () => {
      data.subscription.unsubscribe();
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
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;