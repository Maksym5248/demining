export type IDiff<T extends keyof any, U extends keyof any> = ({ [P in T]: P } & {
    [P in U]: never;
} & { [x: string]: never })[T];

export type IOverwrite<T, U> = Pick<T, IDiff<keyof T, keyof U>> & U;

export type ICreateValue<T> = Omit<T, 'createdAt' | 'updatedAt' | 'authorId' | 'id' | 'isDeleted'>;
export type ICreateInnerValue<T> = Omit<T, 'createdAt' | 'updatedAt'>;
export type IUpdateValue<T> = Partial<Omit<T, 'createdAt' | 'updatedAt' | 'authorId' | 'id' | 'isDeleted'>>;
