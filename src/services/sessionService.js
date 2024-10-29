import { supabase } from "@/utils/supabase";
import { updateUserStreak } from "./userService";

/**
 * Creates a new session in the database.
 * @param {Object} sessionData - The data for the new session.
 * @param {number} sessionData.user_id - The ID of the user.
 * @param {number} sessionData.deck_id - The ID of the deck.
 * @param {string} sessionData.date_reviewed - The date the session was reviewed.
 * @returns {Promise<Object>} The created session data.
 * @throws Will throw an error if the session creation fails.
 */
export const createSession = async (sessionData) => {
  const { data, error } = await supabase
    .from("sessions")
    .insert([sessionData])
    .select("*");
  if (error) throw error;

  console.log("Session created:", data);

  // Update the user's streak
  await updateUserStreak(sessionData.user_id, sessionData.date_reviewed);

  return data;
};

/**
 * Fetches all sessions for a specific user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} An array of session data.
 * @throws Will log an error and return an empty array if the fetch fails.
 */
export const getSessionsByUser = async (userId) => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", userId)
    .order("date_reviewed", { ascending: false });

  if (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }

  return data;
};

/**
 * Fetches all sessions for a specific deck.
 * @param {number} deckId - The ID of the deck.
 * @returns {Promise<Array>} An array of session data.
 * @throws Will log an error and return an empty array if the fetch fails.
 */
export const getSessionsByDeck = async (deckId) => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("deck_id", deckId)
    .order("date_reviewed", { ascending: false });

  if (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }

  return data;
};

/**
 * Fetches a specific session by its ID.
 * @param {number} sessionId - The ID of the session.
 * @returns {Promise<Object|null>} The session data or null if not found.
 * @throws Will log an error and return null if the fetch fails.
 */
export const getSessionById = async (sessionId) => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error) {
    console.error("Error fetching session:", error);
    return null;
  }

  return data;
};
