import { supabase } from "@/utils/supabase";
import { updateUserStreak } from "./userService";

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

export const getSessionsByUser = async (userId) => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", userId)
    .order("date_reviewed", { ascending: false });

  if (error) {
    console.error("Error fetching decks:", error);
    return [];
  }

  return data;
};

export const getSessionsByDeck = async (deckId) => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("deck_id", deckId)
    .order("date_reviewed", { ascending: false });

  if (error) {
    console.error("Error fetching decks:", error);
    return [];
  }

  return data;
};

export const getSessionById = async (sessionId) => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error) {
    console.error("Error fetching deck:", error);
    return null;
  }

  return data;
};
