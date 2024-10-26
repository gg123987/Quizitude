import { useEffect, useState } from "react";
import { checkUserStreak } from "@/services/userService";

const useStreak = (userId) => {
  const [streakData, setStreakData] = useState(null);

  useEffect(() => {
    // Function to check streak upon login or activity
    const updateStreak = async () => {
      try {
        const data = await checkUserStreak(userId); // Call Supabase function/API
        setStreakData(data);
        console.log("Streak updated:", data);
      } catch (error) {
        console.error("Error checking streak:", error.message);
      }
    };

    // Initial streak check
    updateStreak();

    // Calculate time until midnight
    const now = new Date();
    const timeUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime();

    // Set a timeout to recheck streak at midnight
    const midnightTimeout = setTimeout(updateStreak, timeUntilMidnight);

    // Clear timeout if component unmounts
    return () => clearTimeout(midnightTimeout);
  }, [userId]);

  return streakData;
};

export default useStreak;
