import React, { useState } from "react";
import CustomButton from "@/components/common/CustomButton";
import "./sessionstable.css";

/**
 * SessionsTable component displays a paginated table of session scores.
 *
 * @param {Array} sessions - Array of session objects containing score details.
 */
const SessionsTable = ({ sessions }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 7; // Set based on screen size

  // Calculate the total number of pages needed for the sessions
  const totalPages = Math.ceil(sessions.length / rowsPerPage);

  // Get the data for the current page
  const currentData = sessions.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  /**
   * Format the date string to a more readable format.
   */
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  /**
   * Format the time string to show how long ago the session was reviewed.
   */
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);

    // Return the time in seconds if less than a minute
    // Return the time in minutes if less than an hour
    // Otherwise, return the time in HH:MM format

    if (diffInMinutes < 1) {
      return `${diffInSeconds} secs ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} mins ago`;
    } else {
      const options = { hour: "2-digit", minute: "2-digit" };
      return date.toLocaleTimeString(undefined, options);
    }
  };

  return (
    <div className="table-container">
      <div className="table-content">
        <table className="deck-table">
          <thead>
            <tr className="deck-header-table">
              <th>Deck</th>
              <th>Date Reviewed</th>
              <th>Time</th>
              <th>Knew</th>
              <th>Didn't Know</th>
              <th>Overall Score</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((score, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <td>{score.deck_name}</td>
                <td>{formatDate(score.date_reviewed)}</td>
                <td>{formatTime(score.date_reviewed)}</td>
                <td>{score.correct}</td>
                <td>{score.incorrect}</td>
                <td>{score.score.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-spacer"></div>
      {totalPages > 1 && (
        <div className="pagination-controls">
          <CustomButton
            className="nav-button"
            onClick={handlePrev}
            disabled={currentPage === 0}
            style={{
              color: "#344054",
              backgroundColor: "#FFFFFF",
              width: "100px",
              borderColor: "",
              border: "1px solid #D0D5DD",
              margin: 0,
            }}
          >
            Previous
          </CustomButton>
          <span className="pagination-text">
            Page {currentPage + 1} of {totalPages}
          </span>
          <CustomButton
            className="nav-button"
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            style={{
              color: "#344054",
              backgroundColor: "#FFFFFF",
              width: "100px",
              borderColor: "",
              border: "1px solid #D0D5DD",
              margin: 0,
            }}
          >
            Next
          </CustomButton>
        </div>
      )}
    </div>
  );
};

export default SessionsTable;
