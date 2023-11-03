import dayjs from 'dayjs';

// type Formats = 'MMM dd, HH:mm' | 'HH:mm' | 'MMM dd' | 'HH : mm' | 'HH:mm:ss';

const today = () => dayjs(new Date());

export const dates = {
  today,
};
