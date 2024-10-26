import { useState, useEffect } from "react";
import {
  getSessionsByUser,
  getSessionsByDeck,
} from "@/services/sessionService";

export const useSessions = (userId) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getSessionsByUser(userId);
        setSessions(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [userId]);

  return { sessions, loading, error };
};

export const useDeckSessions = (deckId) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getSessionsByDeck(deckId);
        setSessions(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [deckId]);

  return { sessions, loading, error };
};
