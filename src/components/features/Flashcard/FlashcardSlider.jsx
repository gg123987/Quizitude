import PropTypes from "prop-types";
import Flashcard from "./Flashcard";
import "./flashcard.css";

const FlashcardSlider = ({
  flashcards,
  reviewedCards,
  currentCardIndex,
  onCardClick,
}) => {
  return (
    <div className="flashcard-slider">
      {flashcards.map((flashcard, index) => {
        const isReviewed = reviewedCards.includes(flashcard.id);
        const isCurrentCard = currentCardIndex === index;

        return (
          <div key={flashcard.id} onClick={() => onCardClick(index)}>
            <Flashcard
              flashcard={flashcard}
              isCurrentCard={isCurrentCard}
              width={"220px"}
              height={"150px"}
              mode={"studying"}
              isReviewed={isReviewed}
            />
          </div>
        );
      })}
    </div>
  );
};

FlashcardSlider.propTypes = {
  flashcards: PropTypes.array.isRequired,
  reviewedCards: PropTypes.array.isRequired,
  currentCardIndex: PropTypes.number.isRequired,
  onCardClick: PropTypes.func.isRequired,
};

export default FlashcardSlider;
