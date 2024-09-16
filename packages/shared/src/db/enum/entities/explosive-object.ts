export enum EXPLOSIVE_OBJECT_STATUS {
    CONFIRMED = 'CONFIRMED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING',
}

export enum EXPLOSIVE_OBJECT_COMPONENT {
    AMMO = 'AMMO',
    FUSE = 'FUSE',
}

export enum EXPLOSIVE_OBJECT_CLASS {
    PURPOSE = 'PURPOSE', // за призначенням
    METHOD = 'METHOD', // за способом ураження
    FRAGMENTATION = 'FRAGMENTATION', // За зоною розльоту осколків
    STABILIZATION = 'STABILIZATION', // за способом стабілізації в польоті
    DELIVERY = 'DELIVERY', // за способом доставки
    CALIBER = 'CALIBER', // за калібром

    // Ракети
    TRAJECTORY = 'TRAJECTORY', // за траєкторією
    CLASS = 'CLASS', // за класом
    RANGE = 'RANGE', // за дальністю
    ENGINE = 'ENGINE', // за двигуном
    CHARGE = 'CHARGE', // за зарядом
    SPEED = 'SPEED', // за швидкістю
    TARGETING_SYSTEM = 'TARGETING_SYSTEM', // за системою наведення
}

export enum EXPLOSIVE_OBJECT_GROUP {
    ENGINEERING = 'ENGINEERING',
    AVIATION_BOMBS = 'AVIATION_BOMBS',
    GRENADES = 'GRENADES', // АГС, РПГ, СПГ,
    HANDLE_GRENADES = 'HANDLE_GRENADES',
    GUIDED_MISSILES = 'GUIDED_MISSILES',
    ARTILLERY_SHELLS = 'ARTILLERY_SHELLS',
    MORTAL_MINES = 'MORTAL_MINES',
    AMMO = 'AMMO', // Боєприпас стрілецької зброї
    ROСKET = 'ROСKET',
    // UNGUIDED_ROCKETS = 'UNGUIDED_ROCKETS',
    // ANTI_TANK_MISSILES = 'ANTI_TANK_MISSILES', // Протитанковий керований реактивний снаряд
    // ANTI_AIRCRAFT_MISSILE = 'ANTI_AIRCRAFT_MISSILE', // Зенітний ракетний комплекс
    // UNMANNED_AERIAL_VEHICLE = 'UNMANNED_AERIAL_VEHICLE', // БПЛА
}

export enum EXPLOSIVE_OBJECT_TYPE {
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
    SUB = 'SUB',
}

export enum MATERIAL {
    METAL = 'METAL',
    PLASTIC = 'PLASTIC',
}
