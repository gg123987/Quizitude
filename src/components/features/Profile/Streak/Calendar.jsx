import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangeCalendar } from "@mui/x-date-pickers-pro/DateRangeCalendar";
import { DateRangePickerDay as MuiDateRangePickerDay } from "@mui/x-date-pickers-pro/DateRangePickerDay";

// THIS COMPONENT IS NOT USED IN THE CURRENT IMPLEMENTATION
// IT IS PROVIDED AS A REFERENCE FOR FUTURE DEVELOPMENT

// Styling for the highlighted/selected days
const DateRangePickerDay = styled(MuiDateRangePickerDay)(({ theme }) => ({
  variants: [
    {
      props: ({ isHighlighting, outsideCurrentMonth }) =>
        !outsideCurrentMonth && isHighlighting,
      style: {
        borderRadius: 0,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        "&:hover, &:focus": {
          backgroundColor: theme.palette.primary.light,
        },
      },
    },
    {
      props: ({ isStartOfHighlighting }) => isStartOfHighlighting,
      style: {
        borderTopLeftRadius: "50%",
        borderBottomLeftRadius: "50%",
      },
    },
    {
      props: ({ isEndOfHighlighting }) => isEndOfHighlighting,
      style: {
        borderTopRightRadius: "50%",
        borderBottomRightRadius: "50%",
      },
    },
  ],
}));
/**
 * CustomDateRangeCalendar component renders a date range calendar based on the provided streak.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.streak - The number of days in the streak.
 *
 * @returns {JSX.Element} The rendered date range calendar.
 *
 * @example
 * <CustomDateRangeCalendar streak={5} />
 *
 * @remarks
 * - Uses `dayjs` for date manipulation.
 * - Utilizes `LocalizationProvider` and `DateRangeCalendar` from MUI for date range selection.
 * - The calendar is read-only and disabled.
 * - If the streak is greater than 0, the calendar displays the range from `firstDate` to `lastDate`.
 * - If the streak is 0 or less, the calendar does not display a specific range.
 */
export default function CustomDateRangeCalendar({ streak }) {
  const today = dayjs();
  let lastDate = today.subtract(1, "day");
  let firstDate = dayjs();
  if (streak > 0) {
    firstDate = today.subtract(streak, "day");

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateRangeCalendar"]}>
          <DateRangeCalendar
            calendars={1}
            defaultRangePosition="end"
            defaultValue={[firstDate, lastDate]}
            slots={{ day: DateRangePickerDay }}
            readOnly
            disabled="true"
          />
        </DemoContainer>
      </LocalizationProvider>
    );
  } else {
    firstDate = today.subtract(streak, "day");

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateRangeCalendar"]}>
          <DateRangeCalendar
            calendars={1}
            defaultRangePosition="end"
            readOnly
          />
        </DemoContainer>
      </LocalizationProvider>
    );
  }
}
