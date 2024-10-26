import { useOutletContext } from "react-router-dom";
import React, { useState } from "react";
import SelectSort from "@/components/common/SelectSort";
import CircularWithValueLabel from "@/components/common/CircularProgressSpinner";
import { useSessions } from "@/hooks/useSessions";
import SessionsTable from "@/components/features/Scores/SessionsTable";
import "./viewScoreHistory.css";

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

    setSortedSessions(sorted); // Update sortedSessions with sorted data
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
        {loading && <CircularWithValueLabel />}
        {error && <p className="error-message">{error.message}</p>}
        <div className="sessions-table">
          <SessionsTable sessions={sortedSessions} />
        </div>
      </div>
    </div>
  );
};

export default ScoreHistory;
