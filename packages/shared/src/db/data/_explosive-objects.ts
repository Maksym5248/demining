import { EXPLOSIVE_OBJECT_TYPE_V1 } from '../enum';

export const AC = [23, 30, 37, 45, 75, 76, 85, 88, 107, 115, 122, 125, 152, 155, 203];

export const MM = [50, 81, 82, 120, 160, 240];

export const MLRS = [122, 220, 300];

export const RG = ['Ф1', 'РГД-5', 'РГ-42', 'РГН', 'РГО'];

export const IM = [
    'ТМ-62М',
    'МОН-50',
    'МОН-90',
    'МОН-100',
    'МОН-200',
    'ОЗМ-72',
    'ПМН-1',
    'ПМН-2',
    'ПМН-3',
    'ПМН-4',
    'ПФМ-1М',
    'ПФМ-1',
    'ПОМЗ 2',
    'ПОМЗ 2М',
    'МС-1',
    'МС-2',
    'МС-3',
    'МЛ-7',
    'МЛ-8',
];

export const explosiveObjectsData = [
    ...AC.map((caliber) => ({
        typeId: EXPLOSIVE_OBJECT_TYPE_V1.AS,
        name: null,
        caliber,
    })),
    ...MM.map((caliber) => ({
        typeId: EXPLOSIVE_OBJECT_TYPE_V1.MM,
        name: null,
        caliber,
    })),
    ...MLRS.map((caliber) => ({
        typeId: EXPLOSIVE_OBJECT_TYPE_V1.MLRS,
        name: null,
        caliber,
    })),
    ...RG.map((name) => ({
        typeId: EXPLOSIVE_OBJECT_TYPE_V1.RG,
        caliber: null,
        name,
    })),
    ...IM.map((name) => ({
        typeId: EXPLOSIVE_OBJECT_TYPE_V1.IM,
        caliber: null,
        name,
    })),
];
