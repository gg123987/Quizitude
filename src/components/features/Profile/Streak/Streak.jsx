import React, { useState, useEffect } from "react";
import "./streak.css";
import "./Calendar.jsx";
import Divider, { dividerClasses } from "@mui/material/Divider";
import { createClient } from "@supabase/supabase-js";
import CustomDateRangeCalendar from "./Calendar.jsx";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get authenticated user information
//const { data: { user } } = await supabase.auth.getUser()

// Get authenticated user's current streak
//let { data: userStreak, error } = await supabase
// .from('users')
// .select('streak')
// .eq('id', user.id)
// .single()

const Streak = () => {
  const [userStreak, setUserStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStreak = async () => {
      try {
        // Get authenticated user information
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw new Error(authError.message);
        }

        if (user) {
          // Get authenticated user's current streak
          const { data, error: streakError } = await supabase
            .from("users")
            .select("streak")
            .eq("id", user.id)
            .single();

          if (streakError) {
            throw new Error(streakError.message);
          }

          setUserStreak(data);
        } else {
          setUserStreak(null); // No user is logged in
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStreak();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="container">
      <div className="written-streak">
        <span style={{ fontSize: "4rem" }} role="img" aria-label="fire emoji">
          🔥
        </span>
        <div className="written-streak-text">
          <h1 style={{ fontSize: "4rem", margin: "0" }}>{userStreak.streak}</h1>
          <p>Day Streak</p>
        </div>
      </div>
      <Divider
        sx={{
          background: "black",
          borderRightWidth: "0.125rem",
          height: "18rem",
        }}
        orientation="vertical"
      />
      <div>
        <CustomDateRangeCalendar streak={userStreak.streak} />
      </div>
    </div>
  );
};

export default Streak;
