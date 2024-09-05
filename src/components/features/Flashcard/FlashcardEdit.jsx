import PropTypes from "prop-types";
import "./flashcardedit.css";
import TrashIcon from "@/assets/trash-icon";
import EditIcon from "@/assets/edit-icon";

const FlashcardEdit = ({ flashcard }) => {
  const handleDelete = () => {
    // TODO: Implement delete functionality
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="question-box">
            <div className="box-label">Question</div>
            <div className="box-text">{flashcard.question}</div>
          </div>
        </div>
        <div className="col">
          <div className="answer-box">
            <div className="box-label">Answer</div>
            <div className="box-text">{flashcard.answer}</div>
          </div>
        </div>
      </div>
      <div className="delete-edit-icons">
        <div className="delete-icon" onClick={handleDelete}>
          <TrashIcon />
        </div>
        <div className="edit-icon" onClick={handleEdit}>
          <EditIcon />
        </div>
      </div>
    </div>
  );
};

FlashcardEdit.propTypes = {
  flashcard: PropTypes.shape({
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
  }).isRequired,
};

export default FlashcardEdit;
