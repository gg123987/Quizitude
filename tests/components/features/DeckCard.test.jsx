// tests/Deck.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate, MemoryRouter } from "react-router-dom";
import Deck from "@/components/features/DeckCard/Deck";

// Mock the entire react-router-dom module
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    MemoryRouter: ({ children }) => <div>{children}</div>, // Mock MemoryRouter
    useNavigate: vi.fn(), // Mock useNavigate
  };
});

describe("Deck Component", () => {
  const mockNavigate = vi.fn();

  // Mock the useNavigate function
  beforeEach(() => {
    // Set up the mock implementation of useNavigate
    useNavigate.mockImplementation(() => mockNavigate);
    vi.clearAllMocks(); // Clear mocks between tests
  });

  it("renders deck card correctly", () => {
    const deck = {
      id: 1,
      categories: {
        id: 1,
        name: "Category A",
      },
      name: "Deck Name",
      flashcards_count: 5,
    };

    render(
      <MemoryRouter>
        <Deck deck={deck} />
      </MemoryRouter>
    );

    expect(screen.getByText("Deck Name")).toBeInTheDocument();
    expect(screen.getByText("Category A")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("flashcards")).toBeInTheDocument();
  });

  it("navigates to deck details on card click", () => {
    const deck = {
      id: 1,
      categories: {
        id: 1,
        name: "Category A",
      },
      name: "Deck Name",
      flashcards_count: 5,
    };

    render(
      <MemoryRouter>
        <Deck deck={deck} />
      </MemoryRouter>
    );

    // Simulate clicking on the deck card
    fireEvent.click(screen.getByText("Deck Name"));

    expect(mockNavigate).toHaveBeenCalledWith("/decks/1");
  });

  it("navigates to category decks on category button click", () => {
    const deck = {
      id: 1,
      categories: {
        id: 1,
        name: "Category A",
      },
      name: "Deck Name",
      flashcards_count: 5,
    };

    render(
      <MemoryRouter>
        <Deck deck={deck} />
      </MemoryRouter>
    );

    // Simulate clicking on the category button
    fireEvent.click(screen.getByText("Category A"));

    expect(mockNavigate).toHaveBeenCalledWith(
      "/decks?categoryId=1&categoryName=Category+A"
    );
  });
});
