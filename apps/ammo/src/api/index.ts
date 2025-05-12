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
import { AssetStorage } from '~/services';

const services = {
    assetStorage: AssetStorage,
};

export const Api = {
    explosiveObjectType: new ExplosiveObjectTypeAPI(DBRemote, DBLocal, services),
    explosiveObjectClass: new ExplosiveObjectClassAPI(DBRemote),
    explosiveObjectClassItem: new ExplosiveObjectClassItemAPI(DBRemote),
    explosiveObject: new ExplosiveObjectAPI(DBRemote, services),
    explosiveDevice: new ExplosiveDeviceAPI(DBRemote),
    explosive: new ExplosiveAPI(DBRemote, services),
    book: new BookAPI(DBRemote),
    common: new CommonAPI(DBRemote),
    comment: new CommentAPI(DBRemote),
    complain: new ComplainAPI(DBRemote),
    user: new UserAPI(DBRemote),
    currentUser: new CurrentUserAPI(DBRemote, services),
    setLang: (lang: 'uk' | 'en') => DBRemote.setLang(lang),
    init: () => DBRemote.init(),
};
