import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SessionsTable from "@/components/features/Scores/SessionsTable";

// Sample sessions data for testing
const mockSessions = [
  {
    id: "1",
    deck_name: "Math",
    date_reviewed: "2024-10-28T11:56:00Z",
    correct: 5,
    incorrect: 2,
    score: 71.43,
  },
  {
    id: "2",
    deck_name: "Science",
    date_reviewed: "2024-10-27T06:56:10.679Z",
    correct: 4,
    incorrect: 3,
    score: 57.14,
  },
  {
    id: "3",
    deck_name: "History",
    date_reviewed: "2024-10-26T06:56:10.679Z",
    correct: 6,
    incorrect: 1,
    score: 85.71,
  },
  {
    id: "4",
    deck_name: "Literature",
    date_reviewed: "2024-10-25T06:56:10.679Z",
    correct: 3,
    incorrect: 4,
    score: 42.86,
  },
  {
    id: "5",
    deck_name: "Art",
    date_reviewed: "2024-10-24T06:56:10.679Z",
    correct: 2,
    incorrect: 5,
    score: 28.57,
  },
  {
    id: "6",
    deck_name: "Geography",
    date_reviewed: "2024-10-23T06:56:10.679Z",
    correct: 7,
    incorrect: 0,
    score: 100.0,
  },
  {
    id: "7",
    deck_name: "Biology",
    date_reviewed: "2024-10-22T06:56:10.679Z",
    correct: 4,
    incorrect: 3,
    score: 57.14,
  },
  {
    id: "8",
    deck_name: "Chemistry",
    date_reviewed: "2024-10-21T06:56:10.679Z",
    correct: 3,
    incorrect: 2,
    score: 60.0,
  }, // This will be on the next page
];

describe("SessionsTable Component", () => {
  // Mock the current date before running the tests
  const mockCurrentDate = new Date("2024-10-28T12:00:00Z"); // Set the current date to be October 28, 2024
  beforeAll(() => {
    vi.useFakeTimers().setSystemTime(mockCurrentDate);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test("renders sessions correctly", () => {
    render(<SessionsTable sessions={mockSessions} />);

    // Check the header
    expect(screen.getByText(/deck/i)).toBeInTheDocument();
    expect(screen.getByText(/date reviewed/i)).toBeInTheDocument();
    expect(screen.getByText(/time/i)).toBeInTheDocument();
    expect(screen.getByText(/knew/i)).toBeInTheDocument();
    expect(screen.getByText(/didn't know/i)).toBeInTheDocument();
    expect(screen.getByText(/overall score/i)).toBeInTheDocument();

    // Check the first row
    expect(screen.getByText("Math")).toBeInTheDocument();
    expect(screen.getByText("28 Oct 2024")).toBeInTheDocument(); // Date format check
    expect(screen.getByText("4 mins ago")).toBeInTheDocument(); // Time format check
    expect(screen.getByText("71.43%")).toBeInTheDocument();
  });

  test("handles pagination correctly", () => {
    render(<SessionsTable sessions={mockSessions} />);

    // Initially, there should be 7 sessions shown
    expect(screen.getAllByRole("row").length).toBe(8); // 1 header + 7 data rows

    // Click the Next button
    fireEvent.click(screen.getByText(/next/i));

    // Now we should see the Chemistry session
    expect(screen.getByText("Chemistry")).toBeInTheDocument();
    expect(screen.queryByText("Math")).not.toBeInTheDocument(); // Math should no longer be present
    expect(screen.getAllByRole("row").length).toBe(2); // 1 header + 1 data row

    // Click the Previous button
    fireEvent.click(screen.getByText(/previous/i));

    // Math should be back
    expect(screen.getByText("Math")).toBeInTheDocument();
    expect(screen.getAllByRole("row").length).toBe(8); // 1 header + 7 data rows
  });

  test("does not show pagination controls if only one page", () => {
    render(<SessionsTable sessions={mockSessions.slice(0, 5)} />);

    expect(screen.queryByText(/page/i)).not.toBeInTheDocument(); // No pagination text
    expect(screen.queryByText(/next/i)).not.toBeInTheDocument(); // No Next button
    expect(screen.queryByText(/previous/i)).not.toBeInTheDocument(); // No Previous button
  });
});
