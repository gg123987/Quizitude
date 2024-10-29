import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Flashcard from "@/components/features/Flashcard/Flashcard";

describe("Flashcard Component", () => {
  const mockFlashcard = {
    question: "What is the capital of France?",
    answer: "Paris",
    options: ["Paris", "London", "Rome"],
    score: "correct",
    answered: 1,
  };

  it("renders without crashing", () => {
    render(<Flashcard flashcard={mockFlashcard} />);
    expect(screen.getByText(mockFlashcard.question)).toBeInTheDocument();
  });

  it("flips the card to show the answer", () => {
    render(<Flashcard flashcard={mockFlashcard} />);
    fireEvent.click(screen.getByText(mockFlashcard.question));
    expect(screen.getByText(mockFlashcard.answer)).toBeInTheDocument();
  });

  it("does not flip the card if in studying mode with unanswered question", () => {
    render(<Flashcard flashcard={mockFlashcard} mode="studying" />);
    fireEvent.click(screen.getByText(mockFlashcard.question));
    expect(screen.queryByText(mockFlashcard.answer)).not.toBeInTheDocument();
  });

  it("shows a placeholder when the status is hidden", () => {
    // Make sure the score is undefined for the flashcard
    const hiddenFlashcard = {
      question: "What is the capital of France?",
      answer: "Paris",
      options: [],
      score: undefined, // Score is undefined
      answered: undefined,
    };

    render(
      <Flashcard flashcard={hiddenFlashcard} mode="studying" flipped={false} />
    );

    // Check if the placeholder is displayed
    expect(screen.getByTestId("placeholder-icon")).toBeInTheDocument();
  });

  it("changes styles based on the mode and score", () => {
    const { rerender } = render(
      <Flashcard flashcard={mockFlashcard} mode="default" />
    );
    const cardElement = screen.getByTestId("flashcard");

    // Check default styles
    expect(cardElement).toHaveStyle("border-color: white");
    expect(cardElement).toHaveStyle("background-color: rgb(255, 255, 255)");

    // Change to studying mode
    const studyingFlashcard = { ...mockFlashcard, score: "correct" };
    rerender(
      <Flashcard
        flashcard={studyingFlashcard}
        mode="studying"
        isCurrentCard={true}
      />
    );

    // Check updated styles
    expect(cardElement).toHaveStyle("border-color: blue");
    expect(cardElement).toHaveStyle("background-color: #E0EAFF");
  });

  it("handles incorrect score styles", () => {
    const incorrectFlashcard = { ...mockFlashcard, score: "incorrect" };
    render(
      <Flashcard
        flashcard={incorrectFlashcard}
        mode="studying"
        isCurrentCard={false}
      />
    );

    const cardElement = screen.getByTestId("flashcard");

    // Check incorrect styles
    expect(cardElement).toHaveStyle("border-color: red");
    expect(cardElement).toHaveStyle("background-color: #FFE6E4");
  });

  it("syncs flipped prop with internal state", () => {
    const { rerender } = render(
      <Flashcard flashcard={mockFlashcard} flipped={true} />
    );
    expect(screen.getByText(mockFlashcard.answer)).toBeInTheDocument();

    rerender(<Flashcard flashcard={mockFlashcard} flipped={false} />);
    expect(screen.queryByText(mockFlashcard.answer)).not.toBeInTheDocument();
  });
});
