import { type EXPLOSIVE_OBJECT_TYPE_V1, type EXPLOSIVE_OBJECT_GROUP, type EXPLOSIVE_OBJECT_STATUS, type IAmmoDB, type IFuseDB } from '~/db';

import { type IBaseDB } from '../common';

// TODO: 1 - класифікацію за типом боєприпасу, інженерний, арт снаряд, авіаційна бомба, краще якщо ці типи вручну можна додавати
//       2 - група повинна бути в одному екземплярі

// 1 - артилерійський снаряд
//   1.1  за призначенням
//       1.1.1 ...
//       1.1.2 ...
//   1.2 за способом стабілізації
//       ...

export interface IExplosiveObjectTypeDB extends IBaseDB {
    name: string; // приклад: за призначенням, тип ураження, спосіб ураження
    parentId: string | null;
}

export interface IExplosiveObjectDBv1 extends IBaseDB {
    typeId: EXPLOSIVE_OBJECT_TYPE_V1;
    name: string | null;
    caliber: number | null;
}

export interface IExplosiveObjectDBv2 extends IBaseDB {
    typeId: EXPLOSIVE_OBJECT_TYPE_V1;
    name: string | null;
    caliber: number | null;
    meta: {
        copy: {
            group: EXPLOSIVE_OBJECT_GROUP;
            typeIds: string[];
            caliber: number | null;
        };
    };
}

export interface IExplosiveObjectDB extends IBaseDB {
    name: string | null;
    status: EXPLOSIVE_OBJECT_STATUS;
    group: EXPLOSIVE_OBJECT_GROUP;
    typeIds: string[];
    details: IAmmoDB | IFuseDB | null;
}
