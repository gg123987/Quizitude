import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MonthIndicator from "@/components/features/Streaks/MonthIndicator";

describe("MonthIndicator Component", () => {
  // Mock the current date before running the tests
  const today = new Date("2024-10-28T12:00:00Z"); // Set the current date to be October 28, 2024
  beforeAll(() => {
    vi.useFakeTimers().setSystemTime(today);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test("renders the correct month and year", () => {
    const streakCount = 5;
    const studiedToday = true;

    render(
      <MonthIndicator streakCount={streakCount} studiedToday={studiedToday} />
    );

    const dateString = today.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    expect(screen.getByText(dateString)).toBeInTheDocument(); // Check the header month and year
  });

  test("displays streak days correctly", () => {
    const streakCount = 5;
    const studiedToday = true;

    render(
      <MonthIndicator streakCount={streakCount} studiedToday={studiedToday} />
    );

    const streakDays = screen
      .getAllByText(/./)
      .filter((day) => day.textContent !== ""); // Get all days that have text

    // Check if the number of streak days is correct
    expect(streakDays.length).toBeGreaterThan(0);
    expect(
      streakDays.filter((day) => day.classList.contains("streak")).length
    ).toBe(streakCount);
  });

  test("disables the Previous button when trying to navigate more than a year in the past", () => {
    const streakCount = 3;
    const studiedToday = true;

    render(
      <MonthIndicator streakCount={streakCount} studiedToday={studiedToday} />
    );

    const prevButton = screen.getByLabelText("Previous");

    // Navigate back more than a year
    for (let i = 0; i < 13; i++) {
      fireEvent.click(prevButton); // Click the Previous button 13 times
    }

    // Now, check if Previous button is disabled
    expect(prevButton).toBeDisabled();
  });

  test("disables the Next button when trying to navigate to a future month", () => {
    const streakCount = 3;
    const studiedToday = true;

    render(
      <MonthIndicator streakCount={streakCount} studiedToday={studiedToday} />
    );

    const nextButton = screen.getByLabelText("Next");

    // Check if the Next button is disabled
    expect(nextButton).toBeDisabled(); // Next button should be disabled
  });

  test("allows navigating to the previous month if it's within a year", () => {
    const streakCount = 3;
    const studiedToday = true;

    render(
      <MonthIndicator streakCount={streakCount} studiedToday={studiedToday} />
    );

    const prevButton = screen.getByLabelText("Previous");
    expect(prevButton).not.toBeDisabled(); // Should be enabled for this test

    // Click the Previous button
    fireEvent.click(prevButton);

    const previousMonthString = new Date(
      today.getFullYear(),
      today.getMonth() - 1
    ).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    expect(screen.getByText(previousMonthString)).toBeInTheDocument();
  });

  test("allows navigating to the next month if not a future month", () => {
    // Set up the date to a past date so we can navigate to the next month
    const pastDate = new Date("2024-09-28T12:00:00Z"); // Set a date in the past, September 2024
    beforeAll(() => {
      vi.useFakeTimers().setSystemTime(pastDate);
    });

    const streakCount = 3;
    const studiedToday = true;

    render(
      <MonthIndicator streakCount={streakCount} studiedToday={studiedToday} />
    );

    const nextButton = screen.getByLabelText("Next");

    // Click the Next button to navigate to November 2024
    fireEvent.click(nextButton);

    const nextMonthString = new Date(
      pastDate.getFullYear(),
      pastDate.getMonth() + 1 // October
    ).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    // Check that the month displayed is October 2024
    expect(screen.getByText(nextMonthString)).toBeInTheDocument();
  });

  test("disables the Next button when at the current month", () => {
    const streakCount = 3;
    const studiedToday = true;

    render(
      <MonthIndicator streakCount={streakCount} studiedToday={studiedToday} />
    );

    // Check if Next button is enabled/disabled correctly
    const nextButton = screen.getByLabelText("Next");
    expect(nextButton).toBeDisabled(); // Next button should be disabled
  });
});
