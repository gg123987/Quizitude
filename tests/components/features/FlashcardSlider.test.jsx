import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FlashcardSlider from "@/components/features/Flashcard/FlashcardSlider";

// Mock the Flashcard component
vi.mock("@/components/features/Flashcard/Flashcard", () => ({
  default: ({ flashcard, isCurrentCard }) => (
    <div data-testid="flashcard" className={isCurrentCard ? "current" : ""}>
      <h2>{flashcard.question}</h2>
    </div>
  ),
}));

describe("FlashcardSlider Component", () => {
  const flashcards = [
    { id: 1, question: "What is React?" },
    { id: 2, question: "What is JSX?" },
  ];
  const reviewedCards = [1];
  const onCardClick = vi.fn();
  const currentCardIndex = 0;

  beforeEach(() => {
    render(
      <FlashcardSlider
        flashcards={flashcards}
        reviewedCards={reviewedCards}
        currentCardIndex={currentCardIndex}
        onCardClick={onCardClick}
      />
    );
  });

  it("renders the correct number of flashcards", () => {
    const cardElements = screen.getAllByTestId("flashcard");
    expect(cardElements.length).toBe(flashcards.length);
  });

  it("calls onCardClick with the correct index when a card is clicked", () => {
    const firstCard = screen.getByText(/What is React?/i);
    fireEvent.click(firstCard);
    expect(onCardClick).toHaveBeenCalledWith(0);
  });

  it("marks the current card correctly", () => {
    const currentCard = screen.getByText(/What is React?/i);
    expect(currentCard.parentElement).toHaveClass("current"); // Assuming 'current' class is applied to the current card
  });
});
