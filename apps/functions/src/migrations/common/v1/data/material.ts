import { MATERIAL } from 'shared-my';
import { type IMaterialDB } from 'shared-my';

export const materialsData: Pick<IMaterialDB, 'id' | 'name'>[] = [
    {
        id: MATERIAL.METAL,
        name: 'Метал',
    },
    {
        id: MATERIAL.IRON,
        name: 'Залізо',
    },
    {
        id: MATERIAL.STEEL,
        name: 'Сталь',
    },
    {
        id: MATERIAL.CAST_IRON,
        name: 'Чавун',
    },
    {
        id: MATERIAL.DUCTILE_IRON,
        name: 'Сталистий чавун',
    },
    {
        id: MATERIAL.ALUMINIUM,
        name: 'Алюміній',
    },
    {
        id: MATERIAL.PLASTIC,
        name: 'Пластмаса',
    },
    {
        id: MATERIAL.PLASTIC_AG_4V,
        name: 'Пластмаса АГ-4В',
    },
    {
        id: MATERIAL.COPPER,
        name: 'Мідь',
    },
    {
        id: MATERIAL.BRASS,
        name: 'Латунь',
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
    {
        id: MATERIAL.TEXTILE,
        name: 'Тканина',
    },
];
