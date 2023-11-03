import { Dayjs} from 'dayjs';

export interface IOrderForm {
    number: number;
    signedBy: string;
    executedAt: Dayjs;
}