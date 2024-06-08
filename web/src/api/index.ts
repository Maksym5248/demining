import {
    employee,
    equipment,
    explosiveObject,
    explosive,
    missionReport,
    missionRequest,
    order,
    transport,
    user,
    organization,
    document,
    map,
} from './controllers';

export * from './external';

export * from './types';

const createExplosiveObjects = async () => {
    await explosiveObject.init();
};

export const Api = {
    employee,
    equipment,
    explosiveObject,
    explosive,
    missionReport,
    missionRequest,
    order,
    transport,
    user,
    organization,
    document,
    map,
    createExplosiveObjects,
};
