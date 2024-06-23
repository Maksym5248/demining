import { type Dayjs } from 'dayjs';

export interface IOrderForm {
    number: number;
    signedById: string;
    signedAt: Dayjs;
}
