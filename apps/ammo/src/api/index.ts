import {
    ExplosiveObjectAPI,
    ExplosiveDeviceAPI,
    ExplosiveObjectTypeAPI,
    ExplosiveObjectClassAPI,
    ExplosiveObjectClassItemAPI,
    ExplosiveAPI,
    BookAPI,
    CommonAPI,
} from 'shared-my-client';

import { DB } from '~/db';
import { AssetStorage } from '~/services';

const services = {
    assetStorage: AssetStorage,
};

export const Api = {
    explosiveObjectType: new ExplosiveObjectTypeAPI(DB, services),
    explosiveObjectClass: new ExplosiveObjectClassAPI(DB),
    explosiveObjectClassItem: new ExplosiveObjectClassItemAPI(DB),
    explosiveObject: new ExplosiveObjectAPI(DB, services),
    explosiveDevice: new ExplosiveDeviceAPI(DB),
    explosive: new ExplosiveAPI(DB, services),
    book: new BookAPI(DB),
    common: new CommonAPI(),
};
