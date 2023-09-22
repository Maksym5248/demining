import { dates } from './dates';

describe('Utils dates', () => {
  it('getDateForMinutesInterval default', () => {
    const d = dates.getDateForMinutesInterval(new Date('2021-12-17T03:21:00'), 5);
    expect('03:25').toBe(dates.format(d, 'HH:mm'));
  });

  it('getDateForMinutesInterval without increment', () => {
    const d = dates.getDateForMinutesInterval(new Date('2021-12-17T03:20:00'), 5);
    expect('03:20').toBe(dates.format(d, 'HH:mm'));
  });

  it('getDateForMinutesInterval last minutes', () => {
    const d = dates.getDateForMinutesInterval(new Date('2021-12-17T03:56:00'), 5);
    expect('04:00').toBe(dates.format(d, 'HH:mm'));
  });

  it('mergeHoursMinutes last minutes', () => {
    const d = dates.mergeHoursMinutes(
      new Date('2021-12-17T00:00:00'),
      new Date('2021-12-19T03:56:00'),
    );
    expect('Dec 17, 03:56').toBe(dates.format(d, 'MMM dd, HH:mm'));
  });

  it('differenceInDaysRounded', () => {
    const days = dates.differenceInDaysRounded(
      new Date('2021-12-19T00:00:00'),
      new Date('2021-12-17T00:00:00'),
    );
    expect(2).toBe(days);
  });

  it('differenceInDaysRounded rounded', () => {
    const days = dates.differenceInDaysRounded(
      new Date('2021-12-19T00:05:00'),
      new Date('2021-12-17T00:00:00'),
    );

    expect(3).toBe(days);
  });
});
