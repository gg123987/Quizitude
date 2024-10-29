import React from "react";
import { render, screen } from "@testing-library/react";
import FlashcardList from "@/components/features/Flashcard/FlashcardList";

// Mock the Flashcard component to isolate tests for FlashcardList
vi.mock("@/components/features/Flashcard/Flashcard", () => ({
  default: ({ flashcard, flipped }) => (
    <div data-testid="flashcard" className={flipped ? "flipped" : ""}>
      <h2>{flashcard.question}</h2>
      {flipped && <p>{flashcard.answer}</p>}
    </div>
  ),
}));

describe("FlashcardList Component", () => {
  const flashcards = [
    {
      id: 1,
      question: "What is React?",
      answer: "A JavaScript library for building user interfaces",
    },
    {
      id: 2,
      question: "What is JSX?",
      answer: "A syntax extension for JavaScript",
    },
  ];

  it("renders the correct number of flashcards", () => {
    render(<FlashcardList flashcards={flashcards} />);

    const cardElements = screen.getAllByTestId("flashcard");
    expect(cardElements.length).toBe(flashcards.length);
  });

  it("renders flashcards with the correct question text", () => {
    render(<FlashcardList flashcards={flashcards} />);

    expect(screen.getByText(/What is React\?/i)).toBeInTheDocument();
    expect(screen.getByText(/What is JSX\?/i)).toBeInTheDocument();
  });

  it("renders flashcards flipped when the flipped prop is true", () => {
    render(<FlashcardList flashcards={flashcards} flipped={true} />);

    const cardElements = screen.getAllByTestId("flashcard");
    expect(cardElements[0]).toHaveClass("flipped"); // Check if the first card is flipped
    expect(cardElements[1]).toHaveClass("flipped"); // Check if the second card is flipped
  });

  it("renders flashcards not flipped when the flipped prop is false", () => {
    render(<FlashcardList flashcards={flashcards} flipped={false} />);

    const cardElements = screen.getAllByTestId("flashcard");
    expect(cardElements[0]).not.toHaveClass("flipped"); // First card should not be flipped
    expect(cardElements[1]).not.toHaveClass("flipped"); // Second card should not be flipped
  });
});
