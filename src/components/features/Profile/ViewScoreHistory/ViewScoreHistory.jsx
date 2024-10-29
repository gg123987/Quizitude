import { useOutletContext } from "react-router-dom";
import React, { useState } from "react";
import SelectSort from "@/components/common/SelectSort";
import CircularProgress from "@mui/material/CircularProgress";
import { useSessions } from "@/hooks/useSessions";
import SessionsTable from "@/components/features/Scores/SessionsTable";
import "./viewScoreHistory.css";

/**
 * ScoreHistory component displays the user's score history with sorting options.
 *
 * @component
 * @example
 * return (
 *   <ScoreHistory />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @description
 * This component fetches and displays the user's score history sessions. It allows
 * sorting of the sessions by date, either showing the most recent or the oldest first.
 * The component handles loading and error states and updates the displayed sessions
 * when the fetched sessions change.
 *
 * @hook
 * @name useOutletContext
 * @description Retrieves the userId from the outlet context.
 *
 * @hook
 * @name useSessions
 * @description Fetches the user's sessions based on the userId.
 * @param {string} userId - The ID of the user whose sessions are being fetched.
 * @returns {Object} An object containing the sessions, loading state, and error state.
 *
 * @function handleSortChange
 * @description Sorts the sessions based on the selected option.
 * @param {string} option - The sorting option selected by the user.
 *
 * @component SelectSort
 * @description A component that provides sorting options for the sessions.
 * @param {function} onSortChange - Callback function to handle sort changes.
 * @param {Array} sortOptions - Array of sorting options.
 * @param {string} width - Width of the select component.
 *
 * @component CircularProgress
 * @description A loading indicator component.
 *
 * @component SessionsTable
 * @description A table component that displays the sorted sessions.
 * @param {Array} sessions - The sessions to be displayed in the table.
 */
const ScoreHistory = () => {
  const { userId } = useOutletContext();
  const { sessions, loading, error } = useSessions(userId);
  const [sortedSessions, setSortedSessions] = useState(sessions);

  // Update sortedSessions when sessions change
  React.useEffect(() => {
    setSortedSessions(sessions);
  }, [sessions]);

  const handleSortChange = (option) => {
    const sorted = [...sessions].sort((a, b) => {
      if (option === "Today") {
        return new Date(b.date_reviewed) - new Date(a.date_reviewed);
      } else if (option === "Oldest") {
        return new Date(a.date_reviewed) - new Date(b.date_reviewed);
      }
      return 0;
    });

    setSortedSessions(sorted);
  };

  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <div className="col-left">
          <h1 className="sessions-title">Score History</h1>
        </div>
        <div className="col-right">
          <SelectSort
            onSortChange={handleSortChange}
            sortOptions={[
              { value: "Today", label: "Today" },
              { value: "Oldest", label: "Oldest" },
            ]}
            width={"12ch"}
          />
        </div>
      </div>

      <div className="sessions-content">
        {loading && <CircularProgress color="inherit" />}
        {error && <p className="error-message">{error.message}</p>}
        <div className="sessions-table">
          <SessionsTable sessions={sortedSessions} />
        </div>
      </div>
    </div>
  );
};

export default ScoreHistory;
