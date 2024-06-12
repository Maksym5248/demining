import { Dayjs } from 'dayjs';

export interface IOrderForm {
    number: number;
    signedById: string;
    signedAt: Dayjs;
}
