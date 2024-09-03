import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { DateRangePickerDay as MuiDateRangePickerDay } from '@mui/x-date-pickers-pro/DateRangePickerDay';

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
                '&:hover, &:focus': {
                    backgroundColor: theme.palette.primary.light,
                },
            },
        },
        {
            props: ({ isStartOfHighlighting }) => isStartOfHighlighting,
            style: {
                borderTopLeftRadius: '50%',
                borderBottomLeftRadius: '50%',
            },
        },
        {
            props: ({ isEndOfHighlighting }) => isEndOfHighlighting,
            style: {
                borderTopRightRadius: '50%',
                borderBottomRightRadius: '50%',
            },
        },
    ],
}));
export default function CustomDateRangeCalendar({ streak }) {
    const today = dayjs();
    let lastDate = today.subtract(1, 'day')
    let firstDate = dayjs();
    if (streak > 0) {
        firstDate = today.subtract(streak, 'day');

        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateRangeCalendar']}>
                    <DateRangeCalendar
                        calendars={1}
                        defaultRangePosition='end'
                        defaultValue={[firstDate, lastDate]}
                        slots={{ day: DateRangePickerDay }}
                        readOnly
                        disabled='true'
                    />
                </DemoContainer>
            </LocalizationProvider>
        );
    } else {
        firstDate = today.subtract(streak, 'day');

        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateRangeCalendar']}>
                    <DateRangeCalendar
                        calendars={1}
                        defaultRangePosition='end'
                        readOnly
                    />
                </DemoContainer>
            </LocalizationProvider>
        );
    }
}

