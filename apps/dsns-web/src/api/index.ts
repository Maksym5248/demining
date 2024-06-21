import {
    EmployeeAPI,
    EquipmentAPI,
    ExplosiveObjectAPI,
    ExplosiveAPI,
    MissionReportAPI,
    MissionRequestAPI,
    OrderAPI,
    TransportAPI,
    UserAPI,
    OrganizationAPI,
    DocumentAPI,
    MapAPI,
    ExternalApi as ExternalApiClass,
} from 'shared-my-client/api';

import { CONFIG } from '~/config';
import { DB } from '~/db';
import { AssetStorage } from '~/services';

export const ExternalApi = new ExternalApiClass(CONFIG.GEO_APIFY_KEY);

const services = {
    assetStorage: AssetStorage,
};

export const Api = {
    employee: new EmployeeAPI(DB),
    equipment: new EquipmentAPI(DB),
    explosiveObject: new ExplosiveObjectAPI(DB),
    explosive: new ExplosiveAPI(DB),
    missionReport: new MissionReportAPI(DB),
    missionRequest: new MissionRequestAPI(DB),
    order: new OrderAPI(DB),
    transport: new TransportAPI(DB),
    user: new UserAPI(DB, services),
    organization: new OrganizationAPI(DB),
    document: new DocumentAPI(DB, services),
    map: new MapAPI(DB),
};
