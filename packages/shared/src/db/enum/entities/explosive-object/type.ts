import { type EXPLOSIVE_OBJECT_TYPE, type IBaseDB } from '~/db';

enum ExplosiveObjectTypeSource {
    NATO = 'NATO',
    USSR = 'USSR',
}

export interface IExplosiveObjectCategoryDB extends IBaseDB {
    source: ExplosiveObjectTypeSource;
    type: EXPLOSIVE_OBJECT_TYPE[];
    name: string; // приклад: за призначенням, тип ураження, спосіб ураження
    parentId: string | null;
}
