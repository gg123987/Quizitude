import React, { useState } from "react";
import { Icon, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import styled from "@mui/material/styles/styled";
import PropTypes from "prop-types";
import "./flashcardedit.css";
import TrashIcon from "@/assets/trash-icon";
import EditIcon from "@/assets/edit-icon";
import DoneIcon from "@mui/icons-material/Done";
import { deleteFlashcard, updateFlashcard } from "@/services/flashcardService";

// Custom styled TextField component with specific styles for focus and hover states
const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "green",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "green",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
  },
});

/**
 * FlashcardEdit component allows editing and deleting of a flashcard.
 *
 * @param {Object} props - Component props
 * @param {Object} props.flashcard - Flashcard data
 * @param {string} props.flashcard.question - Flashcard question
 * @param {string} props.flashcard.answer - Flashcard answer
 * @param {Function} props.onChange - Callback function to trigger when flashcard data changes
 */
const FlashcardEdit = ({ flashcard, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(flashcard.question);
  const [editedAnswer, setEditedAnswer] = useState(flashcard.answer);

  const handleDelete = async () => {
    await deleteFlashcard(flashcard.id);
    onChange();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Save edited flashcard data
  const handleSave = async () => {
    const flashcardData = {
      question: editedQuestion,
      answer: editedAnswer,
    };
    await updateFlashcard(flashcard.id, flashcardData);
    setIsEditing(false);
    onChange();
  };

  return (
    <div className="container">
      <div className="text-row">
        <div className="text-col">
          <div className="question-box">
            <div className="box-label">Question</div>
            {isEditing ? (
              <CssTextField
                variant="outlined"
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                fullWidth
                multiline
                rows={6}
              />
            ) : (
              <div className="box-text">{flashcard.question}</div>
            )}
          </div>
        </div>
        <div className="text-col">
          <div className="answer-box">
            <div className="box-label">Answer</div>
            {isEditing ? (
              <CssTextField
                variant="outlined"
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
                fullWidth
                multiline
                rows={6}
              />
            ) : (
              <div className="box-text">{flashcard.answer}</div>
            )}
          </div>
        </div>
      </div>
      <div className="delete-edit-icons">
        <IconButton onClick={handleDelete}>
          <TrashIcon />
        </IconButton>
        {isEditing ? (
          <IconButton onClick={handleSave}>
            <DoneIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        )}
      </div>
    </div>
  );
};

FlashcardEdit.propTypes = {
  flashcard: PropTypes.shape({
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FlashcardEdit;
