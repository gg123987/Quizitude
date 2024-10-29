import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ScoreHistory from "@/components/features/Profile/ViewScoreHistory/ViewScoreHistory";
import { useOutletContext } from "react-router-dom";
import { useSessions } from "@/hooks/useSessions";

// Mock the hooks and components
vi.mock("@/hooks/useSessions");
vi.mock("@/components/features/Scores/SessionsTable", () => ({
  default: ({ sessions }) => (
    <div data-testid="sessions-table">
      {sessions.map((session) => (
        <div key={session.id}>{session.date_reviewed}</div>
      ))}
    </div>
  ),
}));
vi.mock("@/components/common/SelectSort", () => ({
  default: ({ onSortChange, sortOptions }) => (
    <select onChange={(e) => onSortChange(e.target.value)}>
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

// Mocking react-router-dom to include MemoryRouter and useOutletContext
vi.mock("react-router-dom", () => {
  const actual = vi.importActual("react-router-dom");
  return {
    ...actual,
    MemoryRouter: ({ children }) => <div>{children}</div>, // Mocking MemoryRouter
    useOutletContext: vi.fn(),
  };
});

// Test setup
describe("ScoreHistory Component", () => {
  let mockUserId;
  let mockSessions;

  beforeEach(() => {
    mockUserId = "12345"; // Example user ID
    mockSessions = [
      { id: "1", date_reviewed: "2024-10-28T10:00:00Z" },
      { id: "2", date_reviewed: "2024-10-27T10:00:00Z" },
      { id: "3", date_reviewed: "2024-10-29T10:00:00Z" },
    ];

    // Mock return value of useOutletContext
    useOutletContext.mockReturnValue({ userId: mockUserId });

    // Mock the implementation of useSessions
    useSessions.mockReturnValue({
      sessions: mockSessions,
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks after each test
  });

  test("renders the ScoreHistory component", () => {
    render(
      <MemoryRouter>
        <ScoreHistory />
      </MemoryRouter>
    );

    expect(screen.getByText(/score history/i)).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(); // Changed to queryByText to avoid false positive
  });

  test("displays sessions in a table", () => {
    render(
      <MemoryRouter>
        <ScoreHistory />
      </MemoryRouter>
    );

    // Check if the sessions are displayed
    expect(screen.getByTestId("sessions-table")).toBeInTheDocument();
    expect(screen.getByText("2024-10-28T10:00:00Z")).toBeInTheDocument();
    expect(screen.getByText("2024-10-27T10:00:00Z")).toBeInTheDocument();
    expect(screen.getByText("2024-10-29T10:00:00Z")).toBeInTheDocument();
  });

  test("handles loading state", () => {
    vi.mocked(useSessions).mockReturnValue({
      sessions: [],
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <ScoreHistory />
      </MemoryRouter>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("handles error state", () => {
    const mockError = new Error("Failed to fetch sessions");

    vi.mocked(useSessions).mockReturnValue({
      sessions: [],
      loading: false,
      error: mockError,
    });

    render(
      <MemoryRouter>
        <ScoreHistory />
      </MemoryRouter>
    );

    expect(screen.getByText(/failed to fetch sessions/i)).toBeInTheDocument();
  });

  test("sorts sessions by date when selected", async () => {
    render(
      <MemoryRouter>
        <ScoreHistory />
      </MemoryRouter>
    );

    // Simulate sorting by "Oldest"
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Oldest" },
    });

    await waitFor(() => {
      // Check if the sessions are sorted correctly
      const sessions = screen.getByTestId("sessions-table").children;
      expect(sessions[0].textContent).toBe("2024-10-27T10:00:00Z"); // Oldest first
      expect(sessions[sessions.length - 1].textContent).toBe(
        "2024-10-29T10:00:00Z"
      ); // Most recent last
    });
  });

  test("sorts sessions by date when selected for today", async () => {
    render(
      <MemoryRouter>
        <ScoreHistory />
      </MemoryRouter>
    );

    // Simulate sorting by "Today"
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Today" },
    });

    await waitFor(() => {
      // Check if the sessions are sorted correctly
      const sessions = screen.getByTestId("sessions-table").children;
      expect(sessions[0].textContent).toBe("2024-10-29T10:00:00Z"); // Most recent first
      expect(sessions[sessions.length - 1].textContent).toBe(
        "2024-10-27T10:00:00Z"
      ); // Oldest last
    });
  });
});
