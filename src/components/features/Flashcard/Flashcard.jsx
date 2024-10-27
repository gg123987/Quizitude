import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Typography } from "@mui/material";
import "./flashcard.css";

/**
 * Flashcard component to display a flashcard with question and answer.
 * The card can be flipped to show the answer and has different modes for studying and default.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.flashcard - The flashcard data.
 * @param {string} props.flashcard.question - The question text.
 * @param {string} props.flashcard.answer - The answer text.
 * @param {Array} [props.flashcard.options] - The options for the flashcard (optional).
 * @param {string} [props.flashcard.score] - The score of the flashcard, can be "correct" or "incorrect" (optional).
 * @param {number} [props.flashcard.answered] - The answered status of the flashcard (optional).
 * @param {string} [props.mode="default"] - The mode of the flashcard, can be "default" or "studying".
 * @param {boolean} [props.isCurrentCard=false] - Indicates if the flashcard is the current card.
 * @param {string} [props.width="650px"] - The width of the flashcard.
 * @param {string} [props.height="300px"] - The height of the flashcard.
 * @param {boolean} [props.flipped=false] - Indicates if the flashcard is flipped.
 */
const Flashcard = ({
  flashcard,
  mode = "default",
  isCurrentCard = false,
  width = "650px",
  height = "300px",
  flipped = false,
}) => {
  const [flip, setFlip] = useState(false);

  // Sync the internal flip state with the flipped prop when it changes.
  useEffect(() => {
    if (flipped !== flip) {
      setFlip(flipped);
    }
  }, [flipped]);

  /**
   * Handles the click event to flip the flashcard.
   */
  const handleClick = () => {
    if (
      status === "default" &&
      (flashcard.options == null ||
        flashcard.options?.length === 0 ||
        flashcard.answered !== undefined)
    ) {
      setFlip(!flip);
    }
  };

  // Determine the status of the flashcard based on the mode and other properties.
  const status =
    mode === "studying"
      ? flashcard.score !== undefined || isCurrentCard
        ? "review"
        : "hidden"
      : mode;

  // Determine the outline color of the flashcard based on the mode and score.
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

  // Determine the fill color of the flashcard based on the mode and score.
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

Flashcard.propTypes = {
  flashcard: PropTypes.shape({
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    options: PropTypes.array,
    score: PropTypes.oneOf(["correct", "incorrect"]),
    answered: PropTypes.number,
  }).isRequired,
  mode: PropTypes.oneOf(["default", "studying"]),
  isCurrentCard: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
  flipped: PropTypes.bool,
};

export default Flashcard;
