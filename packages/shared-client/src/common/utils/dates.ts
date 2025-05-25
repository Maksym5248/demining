import { type Timestamp } from '@firebase/firestore-types';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/uk';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';

dayjs.locale('uk');
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

let timestamp: typeof Timestamp;

const genitiveMonths = [
    'січня',
    'лютого',
    'березня',
    'квітня',
    'травня',
    'червня',
    'липня',
    'серпня',
    'вересня',
    'жовтня',
    'листопада',
    'грудня',
];

const today = (): Dayjs => dayjs(new Date());

const fromServerDate = (value: Omit<Timestamp, 'toJSON'>): Dayjs => {
    const res = dayjs(value.toDate());
    return res;
};

const create = (value: number | Date): Dayjs => {
    const res = dayjs(value);
    return res;
};

const createServerDate = (seconds: number, nanoseconds: number): Timestamp => {
    return new timestamp(seconds, nanoseconds);
};

const isServerDate = (value: any): value is Timestamp => {
    return (
        value &&
        typeof value === 'object' &&
        typeof value.toDate === 'function' &&
        typeof value.seconds === 'number' &&
        typeof value.nanoseconds === 'number'
    );
};

const toDateServer = (value: Date | Dayjs) => {
    if (dayjs.isDayjs(value)) {
        // @ts-ignore
        return timestamp?.fromDate(value.toDate());
    }

    // @ts-ignore
    return timestamp?.fromDate(value);
};

const toDate = (value: Date | Dayjs): Date => {
    if (dayjs.isDayjs(value)) {
        return value.toDate();
    }

    return value;
};

function formatGenitiveMonth(date: Dayjs) {
    const monthIndex = dayjs(date).month();
    return genitiveMonths[monthIndex];
}

const startOfDay = () => today().startOf('day');
const startOfWeek = () => today().startOf('week');
const startOfMonth = () => today().startOf('month');
const startOfYear = () => today().startOf('year');
const endOfDay = () => today().endOf('day');
const format = (date?: Date | Dayjs, format?: 'HH:mm:ss' | 'YYYY-MM-DD HH:mm') => {
    if (!date) return '';

    let day = date;

    if (!dayjs.isDayjs(date)) {
        day = create(date);
    }

    return (day as Dayjs).format(format);
};

export const dates = {
    init: (t: typeof Timestamp) => {
        timestamp = t;
    },
    today,
    fromServerDate,
    createServerDate,
    create,
    toDate,
    formatGenitiveMonth,
    toDateServer,
    startOfDay,
    startOfWeek,
    startOfMonth,
    startOfYear,
    endOfDay,
    isServerDate,
    format,
};
