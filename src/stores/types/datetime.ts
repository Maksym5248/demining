import dayjs from 'dayjs';
import { types } from 'mobx-state-tree';

export const DateTimeType = types.custom<string | dayjs.Dayjs, dayjs.Dayjs>({
	name: 'DateTime',
	isTargetType(value) {
		return dayjs.isDayjs(value);
	},
	getValidationMessage(value) {
		if (!!value && dayjs(value).isValid()) return '';

		return `${value} + ' is not a Date`;
	},
	fromSnapshot(value) {
		if (!value) {
			throw Error("there is no value");
		}

		if (dayjs.isDayjs(value)) {
			return value;
		}

		return dayjs(value);
	},
	toSnapshot(value) {
		if (dayjs.isDayjs(value)) {
			return value.toISOString();
		}

		return value;
	}
});