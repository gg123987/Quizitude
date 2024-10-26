import React, { useState } from "react";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./MonthIndicator.css"; // Import CSS styles

const MonthIndicator = ({ streakCount, studiedToday }) => {
  // State to manage the displayed month and year
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const getMonthDays = () => {
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const daysInMonth = [];

    // Pad the start with empty days if the month doesn’t start on Sunday
    for (let i = 0; i < startOfMonth.getDay(); i++) {
      daysInMonth.push(null);
    }

    // Fill in the days of the month
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      daysInMonth.push(i);
    }

    // Pad the end with empty days to ensure alignment
    const endPadding = (7 - (daysInMonth.length % 7)) % 7;
    for (let i = 0; i < endPadding; i++) {
      daysInMonth.push(null);
    }

    return daysInMonth;
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const monthDays = getMonthDays();

  // Calculate streak indices based on the current streak count and today’s date
  const calculateStreakIndices = () => {
    const streakIndices = [];
    const startDate = new Date(today);

    if (!studiedToday) {
      startDate.setDate(today.getDate() - 1);
    }

    for (let i = 0; i < streakCount; i++) {
      const streakDate = new Date(startDate);
      streakDate.setDate(startDate.getDate() - i);

      // Only add dates that belong to the displayed month in currentDate
      if (
        streakDate.getFullYear() === currentDate.getFullYear() &&
        streakDate.getMonth() === currentDate.getMonth()
      ) {
        const dayIndex =
          streakDate.getDate() +
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          ).getDay() -
          1;
        streakIndices.push(dayIndex);
      }
    }
    return streakIndices;
  };

  const streakIndices = calculateStreakIndices();
  const firstStreakIndex = streakIndices[streakIndices.length - 1];
  const lastStreakIndex = streakIndices[0];

  return (
    <div className="month-indicator">
      <div className="header">
        <h2 className="date-string">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="actions">
          <Button
            onClick={handlePrevMonth}
            variant="contained"
            aria-label="Previous"
            disabled={
              currentDate.getMonth() === today.getMonth() &&
              currentDate.getFullYear() === today.getFullYear() - 1
            }
            sx={{
              height: "16px",
              backgroundColor: "rgba(255, 255, 255, 1)",
              boxShadow: "none",
              "&:disabled": {
                backgroundColor: "rgba(255, 255, 255, 1)", // Background when disabled
                color: "rgba(150, 150, 150, 1)", // Text color when disabled
              },
            }}
          >
            <ArrowBackIosIcon
              fontSize="small"
              sx={{ color: "rgba(0, 0, 0, 1)" }}
            />
          </Button>
          <Button
            onClick={handleNextMonth}
            variant="contained"
            aria-label="Next"
            disabled={
              currentDate.getMonth() === today.getMonth() &&
              currentDate.getFullYear() === today.getFullYear()
            }
            sx={{
              height: "16px",
              marginLeft: "10px",
              backgroundColor: "rgba(255, 255, 255, 1)",
              boxShadow: "none",
              "&:disabled": {
                backgroundColor: "rgba(255, 255, 255, 1)",
                color: "rgba(150, 150, 150, 1)",
              },
            }}
          >
            <ArrowForwardIosIcon
              sx={{ color: "rgba(0, 0, 0, 1)" }}
              fontSize="small"
            />
          </Button>
        </div>
      </div>
      <div className="days">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="day">
            {day}
          </div>
        ))}
      </div>
      <div className="numbers">
        {monthDays.map((day, index) => {
          const isToday =
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();

          // Check if the current index is a Sunday and if it's the first streak index
          const isStreakStart =
            index === firstStreakIndex ||
            (index % 7 === 0 && streakIndices.includes(index));
          // Check if the current index is a Saturday and if it's the last streak index
          const isStreakEnd =
            index === lastStreakIndex ||
            (index % 7 === 6 && streakIndices.includes(index));

          return (
            <div
              key={index}
              className={`number ${
                streakIndices.includes(index) ? "streak" : ""
              } ${isStreakStart ? "streak-start" : ""} ${
                isStreakEnd ? "streak-end" : ""
              }`}
            >
              {day || ""}
              {isToday && <div className="dot-indicator"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthIndicator;
