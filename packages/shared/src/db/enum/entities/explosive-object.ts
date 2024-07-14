export enum EXPLOSIVE_OBJECT_STATUS {
    CONFIRMED = 'CONFIRMED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING',
}

export enum EXPLOSIVE_OBJECT_GROUP {
    AMMO = 'AMMO',
    FUSE = 'FUSE',
}

export enum MANUFACTURED_COUNTRY {
    USSR = 'USSR',
}

// enum EXPLOSIVE_OBJECT_CLASS {
//     PURPOSE = 'PURPOSE', // за призначенням
//     METHOD = 'METHOD', // за способом ураження
//     STABILIZATION = 'STABILIZATION', // за способом стабілізації в польоті
//     DELIVERY = 'DELIVERY', // за способом доставки
//     CALIBER = 'CALIBER', // за калібром
// }

// enum EXPLOSIVE_OBJECT_TYPE {
//     ENGINEERING = 'ENGINEERING',
//     AVIATION_BOMBS = 'AVIATION_BOMBS',
//     GRENADES = 'GRENADES', // АГС, РПГ, СПГ,
//     HANDLE_GRENADES = 'HANDLE_GRENADES',
//     UNGUIDED_ROCKETS = 'UNGUIDED_ROCKETS',
//     GUIDED_MISSILES = 'GUIDED_MISSILES',
//     ARTILLERY_SHELLS = 'ARTILLERY_SHELLS',
//     MORTAL_MINES = 'MORTAL_MINES',
//     AMMO = 'AMMO', // Боєприпас стрілецької зброї
//     ANTI_TANK_MISSILES = 'ANTI_TANK_MISSILES', // Протитанковий керований реактивний снаряд
//     ANTI_AIRCRAFT_MISSILE = 'ANTI_AIRCRAFT_MISSILE', // Зенітний ракетний комплекс
//     UNMANNED_AERIAL_VEHICLE = 'UNMANNED_AERIAL_VEHICLE', // БПЛА
// }

export enum EXPLOSIVE_OBJECT_TYPE_V1 {
    AB = 'AB',
    UAM = 'UAM',
    AS = 'AS',
    MM = 'MM',
    MLRS = 'MLRS',
    RG = 'RG',
    IM = 'IM',
    AMMO = 'AMMO',
    AGL = 'AGL',
    ATGM = 'ATGM',
    ZRK = 'ZRK',
    CR = 'CR',
    BM = 'BM',
    UAV = 'UAV',
}

export enum MATERIAL {
    METAL = 'METAL',
    PLASTIC = 'PLASTIC',
}
