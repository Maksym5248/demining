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

export enum EXPLOSIVE_OBJECT_TYPE {
    AVIATION_BOMBS = 'AB',
    UAM = 'UAM',
    ARTELERY_SHELL = 'AS',
    MORTAL_MINES = 'MM',
    MLRS = 'MLRS',
    RG = 'RG',
    ENGINEERING = 'IM',
    AMMO = 'AMMO',
    AGL = 'AGL',
    ATGM = 'ATGM',
    ZRK = 'ZRK',
    ROCKET = 'ROCKET',
    UAV = 'UAV',
    SUB = 'SUB',
}

export enum MATERIAL {
    METAL = 'METAL',
    PLASTIC = 'PLASTIC',
}

export enum METHRIC {
    MM = 'mm',
    KG = 'kg',
}
