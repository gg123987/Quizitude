import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FlashcardEdit from "@/components/features/Flashcard/FlashcardEdit";
import * as flashcardService from "@/services/flashcardService";

describe("FlashcardEdit Component", () => {
  const mockFlashcard = {
    id: "1",
    question: "What is the capital of France?",
    answer: "Paris",
  };

  const mockOnChange = vi.fn();

  beforeEach(() => {
    render(<FlashcardEdit flashcard={mockFlashcard} onChange={mockOnChange} />);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the flashcard question and answer", () => {
    expect(screen.getByText("Question")).toBeInTheDocument();
    expect(
      screen.getByText("What is the capital of France?")
    ).toBeInTheDocument();
    expect(screen.getByText("Answer")).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
  });

  it("allows editing of the question and answer", async () => {
    // Click the Edit button
    fireEvent.click(screen.getByRole("button", { name: /edit flashcard/i }));

    console.log(screen.debug());

    // Update the question by selecting the textarea directly
    const questionInput = screen.getByTestId("question-input");
    const answerInput = screen.getByTestId("answer-input");

    // Verify the input fields are in the document
    expect(questionInput).toBeInTheDocument();
    expect(answerInput).toBeInTheDocument();
  });

  it("deletes the flashcard", async () => {
    // Click the Delete button
    fireEvent.click(screen.getByRole("button", { name: /delete flashcard/i }));

    // Check if delete function was called
    await waitFor(() => {
      expect(flashcardService.deleteFlashcard).toHaveBeenCalledWith(
        mockFlashcard.id
      );
      expect(mockOnChange).toHaveBeenCalled();
    });
  });
});
