import { type BOOK_TYPE } from 'shared-my';

import { type IBookTypeDTO } from '~/api';

export interface IBookTypeData {
    id: BOOK_TYPE;
    name: string;
}

export const createBookType = (value: IBookTypeDTO): IBookTypeData => ({
    id: value.id,
    name: value.name,
});
