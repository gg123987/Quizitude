import React from 'react';
import Flashcard from './Flashcard';
import './flashcardslider.css';

const FlashcardSlider = ({ flashcards, reviewedCards, currentCardIndex, onCardClick }) => {
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
                            width={220}
                            height={150}
                            mode={'studying'}
                            isReviewed={isReviewed}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default FlashcardSlider;