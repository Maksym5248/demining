export interface IData {
    id: string;
}

export interface IDataModel<T extends IData> {
    data: T;
    id: string;
    updateFields?: (value: Partial<T>) => void;
}
