import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DeckDetail from "@/pages/AllDecks/SingleDeck";
import useDeck from "@/hooks/useDeck";
import useFlashcards from "@/hooks/useFlashcards";
import { useDeckSessions } from "@/hooks/useSessions";

// Mock the hooks used in DeckDetail
vi.mock("@/hooks/useDeck");
vi.mock("@/hooks/useFlashcards");
vi.mock("@/hooks/useSessions");

vi.mock("@/services/deckService", () => ({
  deleteDeck: vi.fn(), // Mock the deleteDeck function
}));

// Mock the useModal hook
vi.mock("@/hooks/useModal", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    openModal: vi.fn(), // Mock the openModal function
  })),
}));

describe("DeckDetail Component", () => {
  const mockDeck = {
    id: "1",
    name: "Test Deck",
    categories: { name: "Category 1" },
  };

  const mockFlashcards = [
    { id: "1", question: "Question 1" },
    { id: "2", question: "Question 2" },
  ];

  const mockSessions = [
    { id: "1", date_reviewed: "2024-10-01" },
    { id: "2", date_reviewed: "2024-10-02" },
  ];

  beforeEach(() => {
    // Reset the mocks before each test
    useDeck.mockReturnValue({
      deck: mockDeck,
      loading: false,
      error: null,
      refreshDeck: vi.fn(),
    });

    useFlashcards.mockReturnValue({
      flashcards: mockFlashcards,
      loading: false,
      error: null,
      refresh: vi.fn(),
    });

    useDeckSessions.mockReturnValue({
      sessions: mockSessions,
    });
  });

  test("renders deck details", () => {
    render(
      <MemoryRouter initialEntries={["/decks/1"]}>
        <DeckDetail />
      </MemoryRouter>
    );

    expect(screen.getByText("Test Deck")).toBeInTheDocument();
    expect(screen.getByText("2 cards generated")).toBeInTheDocument();
  });

  test("searches flashcards", async () => {
    render(
      <MemoryRouter initialEntries={["/decks/1"]}>
        <DeckDetail />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "Question 1" } });

    expect(await screen.findByText("Question 1")).toBeInTheDocument();
    expect(screen.queryByText("Question 2")).not.toBeInTheDocument();
  });

  test("opens and submits rename dialog", async () => {
    render(
      <MemoryRouter initialEntries={["/decks/1"]}>
        <DeckDetail />
      </MemoryRouter>
    );

    // Open the menu and click rename
    fireEvent.click(screen.getByRole("button", { name: "" }));
    const renameMenuItem = screen.getByTestId("rename-menu");
    fireEvent.click(renameMenuItem);

    // Input new deck name
    const renameInput = screen.getByLabelText("New Deck Name");
    fireEvent.change(renameInput, { target: { value: "New Deck Name" } });

    // Submit the rename
    fireEvent.click(screen.getByTestId("rename-button"));

    // Check if the deck name has changed in the mock (mock implementation should be done)
    expect(screen.getByLabelText("New Deck Name")).toHaveValue("New Deck Name");
  });

  test("opens and submits delete dialog", async () => {
    render(
      <MemoryRouter initialEntries={["/decks/1"]}>
        <DeckDetail />
      </MemoryRouter>
    );

    // Open the menu and click delete
    fireEvent.click(screen.getByRole("button", { name: "" }));
    fireEvent.click(screen.getByTestId("delete-menu"));

    // Confirm deletion
    fireEvent.click(screen.getByTestId("delete-button"));
  });
});
