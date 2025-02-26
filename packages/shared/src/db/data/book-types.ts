import { BOOK_TYPE } from '../enum';
import { type IBookTypeNotDB } from '../types';

export const bookTypes: IBookTypeNotDB[] = [
    {
        id: BOOK_TYPE.AMMUNITION,
        name: 'Боєприпаси',
    },
    {
        id: BOOK_TYPE.EXPLOSIVE,
        name: 'ВР речовини',
    },
    {
        id: BOOK_TYPE.MINING,
        name: 'Підривна справа',
    },
    {
        id: BOOK_TYPE.DEMINING,
        name: 'Розмінування',
    },
    {
        id: BOOK_TYPE.EQUIPMENT,
        name: 'Обладнання',
    },
    {
        id: BOOK_TYPE.ORDER_MO,
        name: 'Накази МО',
    },
    {
        id: BOOK_TYPE.BLASTING,
        name: 'Вибухові роботи',
    },
];

export const bookTypesMap = bookTypes.reduce(
    (acc, item) => {
        acc[item.id] = item;
        return acc;
    },
    {} as Record<BOOK_TYPE, IBookTypeNotDB>,
);
