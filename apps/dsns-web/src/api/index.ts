import { publicIpv4 } from 'public-ip';
import {
    EmployeeAPI,
    EquipmentAPI,
    ExplosiveObjectAPI,
    ExplosiveDeviceAPI,
    MissionReportAPI,
    MissionRequestAPI,
    OrderAPI,
    TransportAPI,
    UserAPI,
    OrganizationAPI,
    DocumentAPI,
    MapAPI,
    ExternalApi as ExternalApiClass,
    ExplosiveObjectTypeAPI,
    ExplosiveObjectClassAPI,
    ExplosiveObjectClassItemAPI,
    ExplosiveAPI,
    BookAPI,
    CommonAPI,
    CurrentUserAPI,
} from 'shared-my-client';

import { CONFIG } from '~/config';
import { DBLocal, DBRemote } from '~/db';
import { AssetStorage } from '~/services';

export const ExternalApi = new ExternalApiClass(CONFIG.GEO_APIFY_KEY, publicIpv4);

const services = {
    assetStorage: AssetStorage,
};

export const Api = {
    employee: new EmployeeAPI(DBRemote),
    equipment: new EquipmentAPI(DBRemote),
    explosiveObjectType: new ExplosiveObjectTypeAPI(DBRemote, DBLocal, services),
    explosiveObjectClass: new ExplosiveObjectClassAPI(DBRemote, DBLocal),
    explosiveObjectClassItem: new ExplosiveObjectClassItemAPI(DBRemote, DBLocal),
    book: new BookAPI(DBRemote, DBLocal),
    common: new CommonAPI(DBRemote, DBLocal),

    explosiveObject: new ExplosiveObjectAPI(DBRemote, DBLocal, services),
    explosiveDevice: new ExplosiveDeviceAPI(DBRemote, DBLocal),
    explosive: new ExplosiveAPI(DBRemote, DBLocal, services),
    missionReport: new MissionReportAPI(DBRemote),
    missionRequest: new MissionRequestAPI(DBRemote),
    order: new OrderAPI(DBRemote),
    transport: new TransportAPI(DBRemote),
    user: new UserAPI(DBRemote),
    currentUser: new CurrentUserAPI(DBRemote, services),
    organization: new OrganizationAPI(DBRemote),
    document: new DocumentAPI(DBRemote, services),
    map: new MapAPI(DBRemote),
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
