import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import StudyMode from "@/pages/Study/StudyMode";
import { vi } from "vitest";
import useAuth from "@/hooks/useAuth";
import { createSession } from "@/services/sessionService";

vi.mock("@/hooks/useAuth");
vi.mock("@/services/sessionService");

const mockUser = { id: "user123" };
const mockFlashcards = [
  {
    id: 1,
    question: "What is the capital of France?",
    answer: "Paris",
    options: [],
  },
  {
    id: 2,
    question: "What is the capital of Spain?",
    answer: "Madrid",
    options: ["Paris", "London", "Berlin", "Madrid"],
  },
];

describe("StudyMode", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
    createSession.mockResolvedValue({ success: true });
  });

  it("renders loading state initially", () => {
    render(
      <MemoryRouter initialEntries={[{ state: {} }]}>
        <Routes>
          <Route path="/" element={<StudyMode />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders flashcards and handles responses", async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            state: {
              flashcards: mockFlashcards,
              deckName: "Geography",
              deckId: "deck123",
            },
          },
        ]}
      >
        <Routes>
          <Route path="/" element={<StudyMode />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Study Mode")).toBeInTheDocument();
    expect(screen.getByText("Geography | 2 cards")).toBeInTheDocument();
    expect(
      screen.getAllByText("What is the capital of France?").length
    ).toBeGreaterThan(0);

    fireEvent.click(screen.getByText("I knew this"));

    // Delay to wait for the next flashcard
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(
      screen.getAllByText("What is the capital of Spain?").length
    ).toBeGreaterThan(0);
  });

  it("handles shuffle and reveal actions", async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            state: {
              flashcards: mockFlashcards,
              deckName: "Geography",
              deckId: "deck123",
            },
          },
        ]}
      >
        <Routes>
          <Route path="/" element={<StudyMode />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Study Mode")).toBeInTheDocument();

    fireEvent.click(screen.getAllByLabelText("shuffle cards")[0]);
    fireEvent.click(screen.getAllByLabelText("shuffle cards")[0]);

    fireEvent.click(screen.getAllByLabelText("shuffle cards")[0]);
    fireEvent.click(screen.getAllByLabelText("shuffle cards")[0]);
  });
});
