import React from "react";
import Flashcard from "./Flashcard";

const FlashcardList = ({ flashcards, flipped=false }) => {
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

export default FlashcardList;
