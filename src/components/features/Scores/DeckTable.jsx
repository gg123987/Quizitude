import React, { useState } from "react";
import CustomButton from "@/components/common/CustomButton";
import "./decktable.css";

const DeckTable = () => {
  const deckScores = [
    {
      deckName: "Deck 1",
      dateReviewed: "2022-01-01",
      timeReviewed: "10:00 AM",
      knewCount: 10,
      didntKnowCount: 2,
      overallScore: 80,
    },
    {
      deckName: "Deck 2",
      dateReviewed: "2022-01-02",
      timeReviewed: "11:00 AM",
      knewCount: 8,
      didntKnowCount: 4,
      overallScore: 60,
    },
    {
      deckName: "Deck 3",
      dateReviewed: "2022-01-03",
      timeReviewed: "12:00 PM",
      knewCount: 12,
      didntKnowCount: 1,
      overallScore: 90,
    },
    {
      deckName: "Deck 1",
      dateReviewed: "2022-01-01",
      timeReviewed: "10:00 AM",
      knewCount: 10,
      didntKnowCount: 2,
      overallScore: 80,
    },
    {
      deckName: "Deck 2",
      dateReviewed: "2022-01-02",
      timeReviewed: "11:00 AM",
      knewCount: 8,
      didntKnowCount: 4,
      overallScore: 60,
    },
    {
      deckName: "Deck 3",
      dateReviewed: "2022-01-03",
      timeReviewed: "12:00 PM",
      knewCount: 12,
      didntKnowCount: 1,
      overallScore: 90,
    },
    {
      deckName: "Deck 1",
      dateReviewed: "2022-01-01",
      timeReviewed: "10:00 AM",
      knewCount: 10,
      didntKnowCount: 2,
      overallScore: 80,
    },
    {
      deckName: "Deck 2",
      dateReviewed: "2022-01-02",
      timeReviewed: "11:00 AM",
      knewCount: 8,
      didntKnowCount: 4,
      overallScore: 60,
    },
    {
      deckName: "Deck 3",
      dateReviewed: "2022-01-03",
      timeReviewed: "12:00 PM",
      knewCount: 12,
      didntKnowCount: 1,
      overallScore: 90,
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 7;

  const totalPages = Math.ceil(deckScores.length / rowsPerPage);

  const currentData = deckScores.slice(
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
                <td>{score.deckName}</td>
                <td>{score.dateReviewed}</td>
                <td>{score.timeReviewed}</td>
                <td>{score.knewCount}</td>
                <td>{score.didntKnowCount}</td>
                <td>{score.overallScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-spacer"></div>
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
    </div>
  );
};

export default DeckTable;
