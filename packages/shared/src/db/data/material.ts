import { MATERIAL } from '../enum';
import { type IMaterialNotDB } from '../types';

export const materialsData: IMaterialNotDB[] = [
    {
        id: MATERIAL.METAL,
        name: 'Метал',
    },
    {
        id: MATERIAL.PLASTIC,
        name: 'Пластик',
    },
    {
        id: MATERIAL.WOOD,
        name: 'Дерево',
    },
];
