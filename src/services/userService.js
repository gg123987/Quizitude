import { supabase } from "@/utils/supabase";
import moment from "moment";

export const getUserById = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
};

export const insertUser = async (user) => {
  const { data, error } = await supabase.from("users").insert([user]);
  if (error) throw error;
  return data;
};

export const updateUser = async (userId, userUpdates) => {
  const { data, error } = await supabase
    .from("users")
    .update(userUpdates)
    .eq("id", userId);
  if (error) throw error;
  return data;
};

/**
 * Updates a user's streak based on their last session date.
 * @param {string} userId - The ID of the user to update.
 * @param {Date} current_date - The current date.
 * @throws Will throw an error if the user's streak cannot be updated.
 */
export const updateUserStreak = async (userId, current_date) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("last_session, current_streak, longest_streak")
    .eq("id", userId)
    .single();
  if (error) throw error;

  const last_session = user.last_session ? new Date(user.last_session) : null;
  const streak = user.current_streak || 0;
  const longest_streak = user.longest_streak || 0;

  let new_streak = streak;

  if (last_session) {
    // Normalize both dates to the start of the day (removing time differences)
    const lastSessionDate = moment(last_session).startOf("day");
    const currentNormalizedDate = moment(current_date).startOf("day");

    // Calculate the difference in days between today and the last session
    const daysDiff = currentNormalizedDate.diff(lastSessionDate, "days");

    console.log("Days difference:", daysDiff);

    if (daysDiff === 1) {
      // If user studied the next consecutive day, increase the streak
      new_streak += 1;
    } else if (daysDiff > 1) {
      // If more than one day has passed, reset the streak
      new_streak = 1;
    }
  } else {
    // If last_session is null, start a new streak
    new_streak = 1;
  }

  console.log("New streak:", new_streak);

  // Save the user's longest streak if this one is the highest
  const new_longest_streak =
    new_streak > longest_streak ? new_streak : longest_streak;

  console.log("New longest streak:", new_longest_streak);

  // Update the user's streak data
  const userUpdates = {
    last_session: current_date,
    current_streak: new_streak,
    longest_streak: new_longest_streak,
  };

  // Update the user's data in the database using updateUser
  await updateUser(userId, userUpdates);
};

/**
 * Checks and resets a user's streak if they missed a day.
 * @param {string} userId - The ID of the user to check.
 * @returns {number} The current streak.
 * @throws Will throw an error if the user's streak cannot be checked.
 */
export const checkUserStreak = async (userId) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("last_session, current_streak, longest_streak")
    .eq("id", userId)
    .single();
  if (error) throw error;

  const last_session = user.last_session ? new Date(user.last_session) : null;
  let streak = user.current_streak || 0;
  const longest_streak = user.longest_streak || 0;
  const current_date = new Date();

  if (last_session) {
    // Normalize both dates to the start of the day (removing time differences)
    const lastSessionDate = moment(last_session).startOf("day");
    const currentNormalizedDate = moment(current_date).startOf("day");

    // Calculate the difference in days between today and the last session
    const daysDiff = currentNormalizedDate.diff(lastSessionDate, "days");

    console.log("Days difference:", daysDiff);

    if (daysDiff > 1) {
      // If more than one day has passed, reset the streak
      streak = 0;

      // Update the user's streak data
      const userUpdates = {
        current_streak: streak,
      };

      // Update the user's data in the database using updateUser
      await updateUser(userId, userUpdates);
    }
  }

  return streak;
};
