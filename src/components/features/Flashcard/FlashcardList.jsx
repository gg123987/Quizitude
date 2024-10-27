import PropTypes from "prop-types";
import Flashcard from "./Flashcard";

/**
 * FlashcardList component renders a list of flashcards.
 *
 * @component
 * @param {Object[]} flashcards - Array of flashcard objects to be displayed.
 * @param {boolean} [flipped=false] - Optional flag to indicate if the flashcards should be displayed flipped.
 *
 * @example
 * const flashcards = [
 *   { id: 1, question: 'What is React?', answer: 'A JavaScript library for building user interfaces' },
 *   { id: 2, question: 'What is JSX?', answer: 'A syntax extension for JavaScript' }
 * ];
 * <FlashcardList flashcards={flashcards} flipped={true} />
 *
 * @returns {JSX.Element} A div containing a grid of Flashcard components.
 */
const FlashcardList = ({ flashcards, flipped = false }) => {
  return (
    <div className="card-grid">
      {flashcards.map((flashcard) => {
        return (
          <Flashcard
            flashcard={flashcard}
            key={flashcard.id}
            flipped={flipped}
          />
        );
      })}
    </div>
  );
};

FlashcardList.propTypes = {
  flashcards: PropTypes.array.isRequired,
  flipped: PropTypes.bool,
};

export default FlashcardList;
