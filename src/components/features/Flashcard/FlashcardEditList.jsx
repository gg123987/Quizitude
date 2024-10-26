import PropTypes from "prop-types";
import FlashcardEdit from "./FlashcardEdit";

const FlashcardEditList = ({ flashcards, refreshFlashcards }) => {
  const handleChange = () => {
    refreshFlashcards();
  };

  return (
    <div className="list-container">
      {flashcards.map((flashcard) => (
        <FlashcardEdit
          key={flashcard.id}
          flashcard={flashcard}
          onChange={handleChange}
        />
      ))}
    </div>
  );
};

FlashcardEditList.propTypes = {
  flashcards: PropTypes.array.isRequired,
  refreshFlashcards: PropTypes.func.isRequired,
};

export default FlashcardEditList;
