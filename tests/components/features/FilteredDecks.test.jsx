import React from "react";
import { render, screen } from "@testing-library/react";
import FilteredDecks from "@/components/features/DisplayDecks/FilteredDecks";

// Mock the Deck component
vi.mock("@/components/features/DeckCard/Deck", () => ({
  default: function MockDeck({ deck }) {
    return <div data-testid={`deck-${deck.id}`}>{deck.name}</div>;
  },
}));

describe("FilteredDecks", () => {
  const mockDecks = [
    { id: 1, name: "Deck 1" },
    { id: 2, name: "Deck 2" },
  ];

  it("renders without crashing", () => {
    render(<FilteredDecks filteredAndSortedDecks={mockDecks} />);

    // Check if the container is in the document
    expect(screen.getByText("Deck 1")).toBeInTheDocument();
    expect(screen.getByText("Deck 2")).toBeInTheDocument();
  });

  it("renders the correct number of Deck components", () => {
    render(<FilteredDecks filteredAndSortedDecks={mockDecks} />);

    const deckElements = screen.getAllByTestId(/deck/i);
    expect(deckElements.length).toBe(mockDecks.length); // Ensure the number of rendered decks matches
  });

  it("renders Deck components with correct props", () => {
    render(<FilteredDecks filteredAndSortedDecks={mockDecks} />);

    // Verify each mock Deck renders with correct name
    mockDecks.forEach((deck) => {
      expect(screen.getByTestId(`deck-${deck.id}`)).toHaveTextContent(
        deck.name
      );
    });
  });
});
