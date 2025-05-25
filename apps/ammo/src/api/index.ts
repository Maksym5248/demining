import {
    ExplosiveObjectAPI,
    ExplosiveDeviceAPI,
    ExplosiveObjectTypeAPI,
    ExplosiveObjectClassAPI,
    ExplosiveObjectClassItemAPI,
    ExplosiveAPI,
    BookAPI,
    CommonAPI,
    CurrentUserAPI,
    CommentAPI,
    UserAPI,
    ComplainAPI,
} from 'shared-my-client';

import { DBRemote, DBLocal } from '~/db';
import { AssetStorage, Storage, Logger } from '~/services';

const services = {
    assetStorage: AssetStorage,
    storage: Storage,
    logger: Logger,
};

export const Api = {
    explosiveObjectType: new ExplosiveObjectTypeAPI(DBRemote, DBLocal, services),
    explosiveObjectClass: new ExplosiveObjectClassAPI(DBRemote, DBLocal, services),
    explosiveObjectClassItem: new ExplosiveObjectClassItemAPI(DBRemote, DBLocal, services),
    explosiveObject: new ExplosiveObjectAPI(DBRemote, DBLocal, services),
    explosiveDevice: new ExplosiveDeviceAPI(DBRemote, DBLocal, services),
    explosive: new ExplosiveAPI(DBRemote, DBLocal, services),
    book: new BookAPI(DBRemote, DBLocal, services),
    common: new CommonAPI(DBRemote, DBLocal, services),
    comment: new CommentAPI(DBRemote),
    complain: new ComplainAPI(DBRemote),
    user: new UserAPI(DBRemote),
    currentUser: new CurrentUserAPI(DBRemote, services),
    setLang: (lang: 'uk' | 'en') => {
        DBRemote.setLang(lang);
        DBLocal.setLang(lang);
    },
    init: async () => {
        await DBRemote.init();
        await DBLocal.init();
    },
    drop: async () => {
        await DBLocal.drop();
    },
};
