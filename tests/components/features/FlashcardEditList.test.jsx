import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FlashcardEditList from "@/components/features/Flashcard/FlashcardEditList";
import FlashcardEdit from "@/components/features/Flashcard/FlashcardEdit";

// Mock the FlashcardEdit component for isolated testing
vi.mock("@/components/features/Flashcard/FlashcardEdit", () => {
  return {
    default: vi.fn(({ flashcard, onChange }) => (
      <div>
        <span>{flashcard.question}</span>
        <span>{flashcard.answer}</span>
        <button onClick={onChange}>Edit</button>
      </div>
    )),
  };
});

describe("FlashcardEditList Component", () => {
  const mockRefreshFlashcards = vi.fn();
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

  beforeEach(() => {
    render(
      <FlashcardEditList
        flashcards={flashcards}
        refreshFlashcards={mockRefreshFlashcards}
      />
    );
  });

  it("renders a list of flashcards", () => {
    // Check if both flashcards are rendered
    expect(screen.getByText(/What is React\?/i)).toBeInTheDocument();
    expect(screen.getByText(/What is JSX\?/i)).toBeInTheDocument();
  });

  it("passes correct props to FlashcardEdit", () => {
    // Ensure FlashcardEdit is called with the right props
    expect(FlashcardEdit).toHaveBeenCalledWith(
      expect.objectContaining({
        flashcard: flashcards[0],
        onChange: expect.any(Function),
      }),
      {}
    );
    expect(FlashcardEdit).toHaveBeenCalledWith(
      expect.objectContaining({
        flashcard: flashcards[1],
        onChange: expect.any(Function),
      }),
      {}
    );
  });

  it("calls refreshFlashcards on change", () => {
    // Simulate calling the onChange function for the first flashcard
    const onChange = FlashcardEdit.mock.calls[0][0].onChange; // Get the onChange function from the first call
    fireEvent.click(screen.getByText(/What is React\?/i)); // Simulate some interaction that would lead to a change
    onChange(); // Call the onChange function

    expect(mockRefreshFlashcards).toHaveBeenCalledTimes(1); // Ensure refreshFlashcards was called
  });
});
