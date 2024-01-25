import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/uk'; // Import Ukrainian locale
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.locale('uk'); // Set Ukrainian as default locale
dayjs.extend(customParseFormat);

const genitiveMonths = [
	'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
	'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
];

const today = ():Dayjs => dayjs(new Date());

const create = (value:Date):Dayjs => dayjs(value);

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

export const dates = {
	today,
	create,
	toDate,
	formatGenitiveMonth,
};
