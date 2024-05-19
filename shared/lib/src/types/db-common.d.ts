import { Timestamp } from "firebase/firestore";
export type IWhere = {
    [field: string]: any;
};
export type IOrder = {
    by: string;
    type?: "asc" | 'desc';
};
export type IQuery = {
    search?: string;
    where?: IWhere;
    order?: IOrder;
    limit?: number;
    startAfter?: string | number | Timestamp;
    startAt?: string | number | Timestamp;
    endAt?: string | number | Timestamp;
};
