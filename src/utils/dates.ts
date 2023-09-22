import * as fns from 'date-fns';
import _ from 'lodash';

const mergeHoursMinutes = (d: Date | number, dateHoursMinutes: Date) =>
  fns.add(fns.setHours(_.isNumber(d) ? create(d) : d, 0), {
    hours: fns.getHours(dateHoursMinutes),
    minutes: fns.getMinutes(dateHoursMinutes),
  });

type Formats = 'MMM dd, HH:mm' | 'HH:mm' | 'MMM dd' | 'HH : mm' | 'HH:mm:ss';

const toFormat = (
  d: Date,
  format: Formats,
  options?: {
    locale?: fns.Locale;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    firstWeekContainsDate?: number;
    useAdditionalWeekYearTokens?: boolean;
    useAdditionalDayOfYearTokens?: boolean;
  },
) => (d ? fns.format(d, format, options) : undefined);

const create = (value: string | number | Date) => (value ? new Date(value) : undefined);
const now = () => new Date();

/** @return 2021-12-26T22:00:00Z */
const toISOString = (d: Date) => (d ? d.toISOString().split('.')[0] + 'Z' : undefined);

const getDateForMinutesInterval = (d: Date | string, interval = 5) => {
  const date = create(d);
  const minutes = fns.getMinutes(date);
  const residual = minutes % interval;
  const increase = residual ? interval - residual : 0;

  return fns.setMinutes(date, minutes + increase);
};

const addHours = (d: Date, hours: number) => fns.addHours(d, hours);
const differenceInDaysRounded = (dateLeft: number | Date, dateRight: number | Date) => {
  const minutes = fns.differenceInMinutes(dateLeft, dateRight);

  return Math.ceil(minutes / 60 / 24);
};
// differenceInMinutes
export const dates = {
  mergeHoursMinutes,
  isSameDay: fns.isSameDay,
  isBefore: fns.isBefore,
  isAfter: fns.isAfter,
  format: toFormat,
  create,
  now,
  toISOString,
  getDateForMinutesInterval,
  addHours,
  differenceInDays: fns.differenceInDays,
  differenceInMinutes: fns.differenceInMinutes,
  differenceInDaysRounded,
  differenceInMilliseconds: fns.differenceInMilliseconds,
};
