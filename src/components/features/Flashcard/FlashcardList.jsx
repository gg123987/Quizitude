import PropTypes from "prop-types";
import Flashcard from "./Flashcard";

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
