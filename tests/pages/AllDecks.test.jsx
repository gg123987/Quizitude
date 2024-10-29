import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Decks from "@/pages/AllDecks/AllDecks";
import useDecks from "@/hooks/useDecks";
import useModal from "@/hooks/useModal";
import { BrowserRouter, useLocation } from "react-router-dom";

// Mock the custom hooks
vi.mock("@/hooks/useDecks");
vi.mock("@/hooks/useModal");
vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useLocation: vi.fn(),
  useOutletContext: () => ({ userId: "123" }),
}));

// Sample mock data
const mockDecks = [
  {
    id: 1,
    name: "Deck 1",
    created_at: "2023-01-01",
    is_favourite: true,
    categories: ["name1", "name2"],
    flashcards_count: 10,
  },
  {
    id: 2,
    name: "Deck 2",
    created_at: "2023-01-01",
    is_favourite: false,
    categories: ["name1", "name2"],
    flashcards_count: 10,
  },
  {
    id: 3,
    name: "Deck 3",
    created_at: "2023-01-01",
    is_favourite: false,
    categories: ["name1", "name2"],
    flashcards_count: 10,
  },
  {
    id: 4,
    name: "Deck 4",
    created_at: "2023-01-01",
    is_favourite: true,
    categories: ["name3", "name4"],
    flashcards_count: 15,
  },
  {
    id: 5,
    name: "Deck 5",
    created_at: "2023-01-01",
    is_favourite: false,
    categories: ["name5", "name6"],
    flashcards_count: 20,
  },
  {
    id: 6,
    name: "Deck 6",
    created_at: "2023-01-01",
    is_favourite: true,
    categories: ["name7", "name8"],
    flashcards_count: 25,
  },
  {
    id: 7,
    name: "Deck 7",
    created_at: "2023-01-01",
    is_favourite: false,
    categories: ["name9", "name10"],
    flashcards_count: 30,
  },
  {
    id: 8,
    name: "Deck 8",
    created_at: "2023-01-01",
    is_favourite: true,
    categories: ["name11", "name12"],
    flashcards_count: 35,
  },
  {
    id: 9,
    name: "Deck 9",
    created_at: "2023-01-01",
    is_favourite: false,
    categories: ["name13", "name14"],
    flashcards_count: 40,
  },
  {
    id: 10,
    name: "Deck 10",
    created_at: "2023-01-01",
    is_favourite: true,
    categories: ["name15", "name16"],
    flashcards_count: 45,
  },
];

describe("Decks Component", () => {
  beforeEach(() => {
    useDecks.mockReturnValue({ decks: mockDecks, loading: false, error: null });
    useModal.mockReturnValue({ openModal: vi.fn() });
    useLocation.mockReturnValue({ search: "" });
  });

  it("renders Decks component correctly", () => {
    render(
      <BrowserRouter>
        <Decks />
      </BrowserRouter>
    );

    expect(screen.getByText(/All Decks/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
  });

  it("displays loading spinner when loading", () => {
    useDecks.mockReturnValue({ decks: [], loading: true, error: null });

    render(
      <BrowserRouter>
        <Decks />
      </BrowserRouter>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("displays error message when there is an error", () => {
    const errorMessage = "Failed to load decks";
    useDecks.mockReturnValue({
      decks: [],
      loading: false,
      error: { message: errorMessage },
    });

    render(
      <BrowserRouter>
        <Decks />
      </BrowserRouter>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("displays filtered decks based on search query", async () => {
    render(
      <BrowserRouter>
        <Decks />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: "Deck 1" } });

    expect(await screen.findByText("Deck 1")).toBeInTheDocument();
    expect(screen.queryByText("Deck 2")).not.toBeInTheDocument();
  });

  it("displays pagination controls when there are multiple pages", () => {
    render(
      <BrowserRouter>
        <Decks />
      </BrowserRouter>
    );

    const nextButton = screen.getByText(/Next/i);
    const previousButton = screen.getByText(/Previous/i);

    expect(nextButton).toBeInTheDocument();
    expect(previousButton).toBeInTheDocument();
  });

  it("navigates to next page on clicking next button", () => {
    render(
      <BrowserRouter>
        <Decks />
      </BrowserRouter>
    );

    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);

    expect(screen.getByText(/Page 2/i)).toBeInTheDocument();
  });

  it('opens modal to create a new deck when "New Deck" button is clicked', () => {
    const openModal = vi.fn();
    useModal.mockReturnValue({ openModal });
    useDecks.mockReturnValue({ decks: [], loading: false, error: null });

    render(
      <BrowserRouter>
        <Decks />
      </BrowserRouter>
    );

    const newDeckButton = screen.getByText(/New Deck/i);
    fireEvent.click(newDeckButton);

    expect(openModal).toHaveBeenCalled();
  });
});
