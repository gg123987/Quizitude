import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import NewDeck from "@/components/features/NewDeck/NewDeckModal";
import useAuth from "@/hooks/useAuth";
import useCategories from "@/hooks/useCategories";
import useModal from "@/hooks/useModal";
import useDecks from "@/hooks/useDecks";
import fetchLLMResponse from "@/api/LLM";
import { uploadFileAndCreateDeck } from "@/services/fileService";

// Mock hooks and services
vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useCategories");
vi.mock("@/hooks/useModal");
vi.mock("@/hooks/useDecks");
vi.mock("@/api/LLM");
vi.mock("@/services/fileService");

describe("NewDeck Component", () => {
  const mockUser = { id: "user1" };
  const mockCategories = [
    { id: "cat1", name: "Category 1" },
    { id: "cat2", name: "Category 2" },
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
    useCategories.mockReturnValue({
      categories: mockCategories,
      categoriesLoading: false,
      categoriesError: null,
      refreshCategories: vi.fn(),
    });
    useModal.mockReturnValue({ modalOpen: true, closeModal: vi.fn() });
    useDecks.mockReturnValue({ decks: [] });
    fetchLLMResponse.mockResolvedValue([
      { question: "Test Question?", answer: "Test Answer" },
    ]);
  });

  test("renders the modal and form elements", () => {
    render(<NewDeck />);

    expect(screen.getByPlaceholderText("Deck Name")).toBeInTheDocument();
    expect(screen.getByLabelText("No of Questions")).toBeInTheDocument();
    expect(screen.getByLabelText("Type of Question")).toBeInTheDocument();
    expect(screen.getByLabelText("Type of Category")).toBeInTheDocument();
  });

  test("handles form input changes", () => {
    render(<NewDeck />);

    const deckNameInput = screen.getByPlaceholderText("Deck Name");
    const questionsInput = screen.getByLabelText("No of Questions");

    fireEvent.change(deckNameInput, { target: { value: "New Deck" } });
    fireEvent.change(questionsInput, { target: { value: 10 } });

    expect(deckNameInput.value).toBe("New Deck");
    expect(questionsInput.value).toBe("10");
  });

  test("shows error message when required fields are missing", async () => {
    render(<NewDeck />);

    const generateButton = screen.getByText("Generate Flashcards");
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText("Please enter a deck name.")).toBeInTheDocument();
    });
  });

  test("calls the generate flashcards API on valid input", async () => {
    render(<NewDeck />);

    const deckNameInput = screen.getByPlaceholderText("Deck Name");
    const questionsInput = screen.getByLabelText("No of Questions");
    const typeOfQuestion = screen.getByLabelText("Type of Question");
    const categorySelect = screen.getByLabelText("Type of Category");
    const fileInput = screen.getByLabelText("Click to upload or drag and drop");

    fireEvent.change(deckNameInput, { target: { value: "Valid Deck" } });
    fireEvent.change(questionsInput, { target: { value: 5 } });
    fireEvent.change(typeOfQuestion, { target: { value: "multiple-choice" } });
    fireEvent.change(categorySelect, { target: { value: "cat1" } });

    const file = new File(["sample"], "sample.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const generateButton = screen.getByText("Generate Flashcards");
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(fetchLLMResponse).toHaveBeenCalledWith(5, file, "multiple-choice");
    });
  });

  test("displays flashcards review after generating flashcards", async () => {
    render(<NewDeck />);

    const deckNameInput = screen.getByPlaceholderText("Deck Name");
    const questionsInput = screen.getByLabelText("No of Questions");
    const generateButton = screen.getByText("Generate Flashcards");

    fireEvent.change(deckNameInput, { target: { value: "Valid Deck" } });
    fireEvent.change(questionsInput, { target: { value: 5 } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText("Review Flashcards")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Question?")).toBeInTheDocument();
    });
  });

  test("handles file upload and removal", () => {
    render(<NewDeck />);

    const fileInput = screen.getByLabelText("Click to upload or drag and drop");
    const file = new File(["sample"], "sample.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText("sample.pdf")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(screen.queryByText("sample.pdf")).not.toBeInTheDocument();
  });
});
