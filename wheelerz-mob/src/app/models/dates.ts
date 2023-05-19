function resetTime(date: Date): void {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
}

function createDateNoTime(): Date {
    const date = new Date();
    resetTime(date);
    return date;
}

export const dateRangeSelectors: DateRangeSelector[] = [
    {
        id: 1,
        title: 'Last Hour', getRange: () => {
            const start = new Date();
            const end = new Date();
            start.setHours(start.getHours() - 1);
            return {
                startDate: start,
                endDate: end
            }
        }
    },
    {
        id: 2,
        title: 'Last 12 Hours', getRange: () => {
            const start = new Date();
            const end = new Date();
            start.setHours(start.getHours() - 12);
            return {
                startDate: start,
                endDate: end
            }
        }
    },
    {
        id: 3,
        title: 'Last 24 Hours', getRange: () => {
            const start = new Date();
            const end = new Date();
            start.setHours(start.getHours() - 24);
            return {
                startDate: start,
                endDate: end
            }
        }
    },
    {
        id: 4,
        title: 'Last 7 Days', getRange: () => {
            const start = createDateNoTime();
            const end = createDateNoTime();
            start.setDate(start.getDate() - 7);
            return {
                startDate: start,
                endDate: end
            }
        }
    },
    {
        id: 5,
        title: 'Last 30 Days', getRange: () => {
            const start = createDateNoTime();
            const end = createDateNoTime();
            start.setDate(start.getDate() - 30);
            return {
                startDate: start,
                endDate: end
            }
        }
    },
    {
        id: 6,
        title: 'Year To Date', getRange: () => {
            const start = createDateNoTime();
            const end = createDateNoTime();
            start.setDate(1);
            start.setMonth(0);
            if (end.getDate() !== 1 && end.getMonth() !== start.getMonth())
                end.setDate(1);
            return {
                startDate: start,
                endDate: end
            }
        }
    },
    {
        id: 7,
        title: 'Last 12 Months', getRange: () => {
            const start = createDateNoTime();
            const end = createDateNoTime();
            start.setMonth(start.getMonth() - 12);
            start.setDate(1);
            return {
                startDate: start,
                endDate: end
            }
        }
    },
    {
        id: 8,
        title: 'Last 13 Months', getRange: () => {
            const start = createDateNoTime();
            const end = createDateNoTime();
            start.setMonth(start.getMonth() - 13);
            start.setDate(1);
            return {
                startDate: start,
                endDate: end
            }
        }
    },
    {
        id: 9,
        title: 'Custom Range', getRange: () => {
            return undefined;
        }
    }
]

export type FullName = { name: string, fullName: string };
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type DateRange = { startDate: Date, endDate: Date };
export type DateRangeSelector = { id: number, title: string, getRange: () => DateRange | undefined }
export type DateRangeResponse = { dateRange: DateRange, selector: DateRangeSelector }

const WeekDays: FullName[] = [
    { fullName: 'Sunday', name: 'Su' },
    { fullName: 'Monday', name: 'Mo' },
    { fullName: 'Monday', name: 'Tu' },
    { fullName: 'Monday', name: 'We' },
    { fullName: 'Monday', name: 'Th' },
    { fullName: 'Monday', name: 'Fr' },
    { fullName: 'Monday', name: 'Sa' }
];

const Months: FullName[] = [
    { fullName: 'January', name: 'Jan' },
    { fullName: 'February', name: 'Feb' },
    { fullName: 'March', name: 'Mar' },
    { fullName: 'April', name: 'Apr' },
    { fullName: 'May', name: 'May' },
    { fullName: 'June', name: 'Jun' },
    { fullName: 'July', name: 'Jul' },
    { fullName: 'August', name: 'Aug' },
    { fullName: 'September', name: 'Sep' },
    { fullName: 'October', name: 'Oct' },
    { fullName: 'November', name: 'Nov' },
    { fullName: 'December', name: 'Dec' }
];

export interface IDatePickerConfig {
    weekDays: FullName[];
    months: FullName[];
    firstDay: WeekDay;
    dateRangeSelectors: DateRangeSelector[];
}

export const DatePickerConfig: IDatePickerConfig = {
    weekDays: WeekDays,
    months: Months,
    firstDay: 1,
    dateRangeSelectors: dateRangeSelectors
}
