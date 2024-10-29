import PropTypes from "prop-types";
import FlashcardEdit from "./FlashcardEdit";

/**
 * FlashcardEditList component renders a list of flashcards that can be edited.
 *
 * @component
 * @param {Object[]} flashcards - Array of flashcard objects to be displayed and edited.
 * @param {Function} refreshFlashcards - Function to refresh the list of flashcards after an edit.
 *
 * @example
 * const flashcards = [
 *   { id: 1, question: 'What is React?', answer: 'A JavaScript library for building user interfaces' },
 *   { id: 2, question: 'What is JSX?', answer: 'A syntax extension for JavaScript' }
 * ];
 * const refreshFlashcards = () => { refresh logic };
 *
 * <FlashcardEditList flashcards={flashcards} refreshFlashcards={refreshFlashcards} />
 */
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
