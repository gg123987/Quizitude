import React, { useState, useEffect } from "react";
import "./flashcard.css";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Typography } from "@mui/material";

const Flashcard = ({
  flashcard,
  mode = "default",
  isCurrentCard = false,
  width = "650px",
  height = "300px",
  flipped = false,
}) => {
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (flipped !== flip) {
      setFlip(flipped);
    }
  }, [flipped]);

  const handleClick = () => {
    if (
      status === "default" &&
      (flashcard.options.length === 0 || flashcard.answered !== undefined)
    ) {
      setFlip(!flip);
    }
  };

  const status =
    mode === "studying"
      ? flashcard.score !== undefined || isCurrentCard
        ? "review"
        : "hidden"
      : mode;
  const outline =
    mode !== "studying"
      ? "white"
      : isCurrentCard && flashcard.score === undefined
      ? "blue"
      : flashcard.score === undefined
      ? "white"
      : flashcard.score === "correct"
      ? "blue"
      : "red";
  const fill =
    mode !== "studying"
      ? "white"
      : flashcard.score === "correct"
      ? "#E0EAFF"
      : flashcard.score === "incorrect"
      ? "#FFE6E4"
      : "white";

  return (
    <div
      className={`card ${flip ? "flip" : ""}`}
      onClick={handleClick}
      style={{ width, height, borderColor: outline, backgroundColor: fill }}
    >
      <div className="badge">
        {flashcard.score === "correct" && (
          <CheckCircleIcon sx={{ color: outline }} />
        )}
        {flashcard.score === "incorrect" && (
          <CancelIcon sx={{ color: outline }} />
        )}
      </div>
      <div className="front">
        <Typography
          className="flashcard-question"
          variant="body1"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {status !== "hidden" && flashcard.question}
          {status === "hidden" && (
            <div className="flashcard-placeholder">
              <QuestionMarkIcon color="action" />
            </div>
          )}
        </Typography>
      </div>
      {flip && mode === "default" && (
        <div className="back">
          <Typography
            className="flashcard-answer"
            variant="body1"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {flashcard.answer}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
