import React from "react";
import "./WeekIndicator.css"; // Import CSS styles

const WeekIndicator = ({ streakCount }) => {
  // Get the current date and the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const currentDate = new Date();
  // For testing: currentDate.setDate(currentDate.getDate() + 3);
  const currentDay = currentDate.getDay(); // Day of the week (0-6)

  // Create an array representing the days of the week and their respective numbers
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const dayNumbers = Array.from({ length: 7 }, (_, i) => {
    // Calculate the date for each day in the week
    const date = new Date(currentDate);
    date.setDate(date.getDate() - currentDay + i); // Adjust date to the correct day of the week
    return date.getDate(); // Get the day of the month
  });

  // Get the indices of the streak days
  const streakIndices = Array.from({ length: currentDay }, (_, i) => {
    const index = currentDay - 1 - i; // Calculate the index in reverse order
    if (streakCount > 0) {
      streakCount--; // Decrease streakCount
      return index; // Return the index if streakCount allows
    }
    return undefined; // If streakCount is exhausted, return undefined
  }).filter((index) => index !== undefined);

  // Determine the first and last indices in the streak
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
