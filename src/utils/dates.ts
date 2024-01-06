import dayjs, { Dayjs } from 'dayjs';

const today = ():Dayjs => dayjs(new Date());

const create = (value:Date):Dayjs => dayjs(value);

const toDate = (value: Date | Dayjs):Date => {
	if(dayjs.isDayjs(value)){
		return value.toDate();
	}

	return value;
};

export const dates = {
	today,
	create,
	toDate,
};
