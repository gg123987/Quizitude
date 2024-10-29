import React from "react";
import "./WeekIndicator.css";

/**
 * WeekIndicator component displays the days of the week and highlights the streak of study days.
 *
 * @param {number} streakCount - The number of consecutive days the user has studied.
 * @param {boolean} studiedToday - Indicates whether the user has studied today.
 */
const WeekIndicator = ({ streakCount, studiedToday }) => {
  // Get the current date and the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const currentDate = new Date();
  const currentDay = currentDate.getDay();

  // Create an array representing the days of the week and their respective numbers
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const dayNumbers = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - currentDay + i); // Adjust date to the correct day of the week
    return date.getDate(); // Get the day of the month
  });

  // Determine the starting index for the streak
  // If the user studied today, the streak starts from the current day
  const startIndex = studiedToday ? currentDay : currentDay - 1;

  // Get the indices of the streak days in reverse order
  // If the streakCount is greater than 0, the streak is displayed
  const streakIndices = Array.from({ length: startIndex + 1 }, (_, i) => {
    const index = startIndex - i;
    if (streakCount > 0) {
      streakCount--;
      return index;
    }
    return undefined; // If streakCount is exhausted, return undefined
  }).filter((index) => index !== undefined);

  // Determine the first and last indices in the streak for styling
  const firstStreakIndex = streakIndices[streakIndices.length - 1];
  const lastStreakIndex = streakIndices[0];

  return (
    <div className="week-indicator">
      <div className="days">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="day">
            {day}
          </div>
        ))}
      </div>
      <div className="numbers">
        {dayNumbers.map((number, index) => (
          <div
            key={index}
            className={`number ${
              streakIndices.includes(index) ? "streak" : ""
            } ${index === firstStreakIndex ? "streak-start" : ""} ${
              index === lastStreakIndex ? "streak-end" : ""
            }`}
            data-testid={`day-${index}`}
          >
            {number}
            {index === currentDay && <div className="dot-indicator"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekIndicator;
