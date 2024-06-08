import { Dayjs } from 'dayjs';

export interface IOrderForm {
    number: number;
    signedById: string;
    executedAt: Dayjs;
}
