import React from "react";
import { render, screen } from "@testing-library/react";
import WeekIndicator from "@/components/features/Streaks/WeekIndicator";
import { expect } from "vitest";

describe("WeekIndicator Component", () => {
  test("renders the days of the week", () => {
    render(<WeekIndicator streakCount={3} studiedToday={true} />);
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

    daysOfWeek.forEach((day) => {
      expect(screen.getAllByText(day).length).toBeGreaterThan(0);
    });
  });

  test("displays the current date indicator", () => {
    const today = new Date();
    render(<WeekIndicator streakCount={3} studiedToday={true} />);

    const currentDayNumber = today.getDate();

    const currentDayElement = screen.getByText(currentDayNumber);
    expect(currentDayElement).toBeInTheDocument();
    expect(
      currentDayElement.querySelector(".dot-indicator")
    ).toBeInTheDocument();
  });

  test("highlights streak days correctly when studied today", () => {
    render(<WeekIndicator streakCount={3} studiedToday={true} />);

    const todayIndex = new Date().getDay(); // Current day index
    const streakCount = 3; // Example streak count

    console.log(todayIndex);

    const days = screen.getAllByTestId(/day-\d+/); // Match all day elements

    days.forEach((day, index) => {
      console.log(index);
      console.log(todayIndex);
      // Check if the day should have a streak class based on its index
      if (index <= todayIndex && index > todayIndex - streakCount) {
        expect(day).toHaveClass("streak");
      } else {
        expect(day).not.toHaveClass("streak");
      }
    });
  });

  test("does not highlight any day if streakCount is zero", () => {
    render(<WeekIndicator streakCount={0} studiedToday={true} />);

    const days = screen.getAllByTestId(/day-\d+/); // Match all day elements

    days.forEach((day) => {
      expect(day).not.toHaveClass("streak");
    });
  });
});
