import { MATERIAL } from '../enum';
import { type IMaterialNotDB } from '../types';

export const materialsData: IMaterialNotDB[] = [
    {
        id: MATERIAL.METAL,
        name: 'Метал',
    },
    {
        id: MATERIAL.STEEL,
        name: 'Сталь',
    },
    {
        id: MATERIAL.PLASTIC,
        name: 'Пластик',
    },
    {
        id: MATERIAL.WOOD,
        name: 'Дерево',
    },
    {
        id: MATERIAL.BALEKIT,
        name: 'Балекіт',
    },
    {
        id: MATERIAL.TEXTOLITE,
        name: 'Текстоліт',
    },
    {
        id: MATERIAL.RUBER,
        name: 'Резина',
    },
];
