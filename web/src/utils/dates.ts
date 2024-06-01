import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/uk';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { Timestamp } from 'firebase/firestore';

dayjs.locale('uk');
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const genitiveMonths = [
	'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
	'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
];

const today = ():Dayjs => dayjs(new Date());

const fromServerDate = (value:Omit<Timestamp, "toJSON">):Dayjs => {
	const res = dayjs(value.toDate());
	return res;
};

const create = (value:number):Dayjs => {
	const res = dayjs(value);
	return res;
};

const toDateServer = (value: Date | Dayjs) => {
	if(dayjs.isDayjs(value)){
		return Timestamp.fromDate(value.toDate());
	}

	return Timestamp.fromDate(value)
};

const toDate = (value: Date | Dayjs):Date => {
	if(dayjs.isDayjs(value)){
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

export const dates = {
	today,
	fromServerDate,
	create,
	toDate,
	formatGenitiveMonth,
	toDateServer,
	startOfDay,
	startOfWeek,
	startOfMonth,
	startOfYear,
	endOfDay
};
