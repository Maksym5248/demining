import { type AMMO_ENGINEERING_TYPE } from './ammo';
import { type FUSE_ENGINEERING_TYPE } from './fuse';

export * from './material';

export enum EXPLOSIVE_OBJECT_TYPE {
    AMMO = 'AMMO',
    FUSE = 'FUSE',
}

export enum DEST_TYPE {
    ENGINEERING = 'ENGINEERING',
    // AVIATION_BOMB = 'AVIATION_BOMB',
    // UNGUIDED_AIR_MISSILE = 'UNGUIDED_AIR_MISSILE',
    // ARTILLERY_PROJECTILE = 'ARTILLERY_PROJECTILE',
    // MORTAR_PROJECTILE = 'MORTAR_PROJECTILE',
    // GRENADE = 'GRENADE',
}

export type AMMO_TYPE = DEST_TYPE | AMMO_ENGINEERING_TYPE;
export type FUSE_TYPE = DEST_TYPE | FUSE_ENGINEERING_TYPE;

// Вибухові речовини
// Пороха
// Піротехнічні суміші
