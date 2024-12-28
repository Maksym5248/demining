import { EXPLOSIVE_OBJECT_TYPE, METHRIC } from '../enum';

export const explosiveObjectTypesData = [
    {
        id: EXPLOSIVE_OBJECT_TYPE.AVIATION_BOMBS,
        name: 'АБ',
        fullName: 'Авіаційна бомба',
        hasCaliber: true,
        metricCaliber: METHRIC.KG,
    },
    {
        id: EXPLOSIVE_OBJECT_TYPE.UAM,
        name: 'НУРС',
        fullName: 'Некерована авіаційна ракета',
        hasCaliber: true,
        metricCaliber: METHRIC.MM,
    },
    {
        id: EXPLOSIVE_OBJECT_TYPE.ARTELERY_SHELL,
        name: 'АС',
        fullName: 'Артилерійський снаряд',
        hasCaliber: true,
        metricCaliber: METHRIC.MM,
    },
    {
        id: EXPLOSIVE_OBJECT_TYPE.MLRS,
        name: 'РС',
        fullName: 'Реактивний снаряд',
        hasCaliber: true,
        metricCaliber: METHRIC.MM,
    },
    {
        id: EXPLOSIVE_OBJECT_TYPE.MORTAL_MINES,
        name: 'ММ',
        fullName: 'Мінометна Міна',
        hasCaliber: true,
        metricCaliber: METHRIC.MM,
    },
    {
        id: EXPLOSIVE_OBJECT_TYPE.RG,
        name: 'РГ',
        fullName: 'Ручна Граната',
        hasCaliber: false,
    },
    {
        id: EXPLOSIVE_OBJECT_TYPE.ENGINEERING,
        name: 'ІМ',
        fullName: 'Інженерна міна',
        hasCaliber: false,
    },
    {
        id: EXPLOSIVE_OBJECT_TYPE.AMMO,
        name: 'Набої',
        fullName: 'Боєприпас стрілецької зброї',
        hasCaliber: true,
        metricCaliber: METHRIC.MM,
    },
    {
        id: EXPLOSIVE_OBJECT_TYPE.AGL,
        name: 'АГС',
        fullName: 'Набої до автоматичного гранатомету',
        hasCaliber: true,
        metricCaliber: METHRIC.MM,
    },
    {
        id: EXPLOSIVE_OBJECT_TYPE.ATGM,
        name: 'ПТУР',
        fullName: 'Протитанковий керований реактивний снаряд',
        hasCaliber: true,
        metricCaliber: METHRIC.MM,
    },
    {
        id: EXPLOSIVE_OBJECT_TYPE.ZRK,
        name: 'ЗРК',
        fullName: 'Зенітний ракетний снаряд',
        hasCaliber: true,
        metricCaliber: METHRIC.MM,
    },
    {
        id: EXPLOSIVE_OBJECT_TYPE.ROCKET,
        name: 'Ракета',
        fullName: 'Ракета',
    },
    {
        id: EXPLOSIVE_OBJECT_TYPE.UAV,
        name: 'БПЛА',
        fullName: 'Безпілотний літальний апарат',
    },
    {
        id: EXPLOSIVE_OBJECT_TYPE.SUB,
        name: 'Касетний боєприпас',
        fullName: 'Касетний боєприпас',
    },
];
