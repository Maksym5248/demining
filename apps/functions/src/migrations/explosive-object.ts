import {
    EXPLOSIVE_OBJECT_TYPE,
    type IExplosiveObjectDBv1,
    type IExplosiveObjectDB,
    type IExplosiveObjectActionDBv1,
    type IExplosiveObjectActionDB,
} from 'shared-my/db';

export const v1Tov2 = (prev: IExplosiveObjectDBv1): IExplosiveObjectDB => {
    const v: IExplosiveObjectDB = {
        id: prev.id,
        createdAt: prev.createdAt,
        updatedAt: prev.updatedAt,
        type: EXPLOSIVE_OBJECT_TYPE.AMMO,
        categoryIds: [],
        name: prev.name,
        isConfirmed: false,
        data: {
            destination: null,
            temperatureRange: null,
            imageIds: [],
            weight: [],
            caliber: prev.caliber,
            body: null,
            size: null,
            structure: null,
            action: null,
            fuseIds: [],
            marking: [],
            neutralization: null,
        },
    };

    if (prev.authorId) v.authorId = prev.authorId;
    if (prev._search) v._search = prev._search;

    return v;
};

const actionV1Tov2 = (prev: IExplosiveObjectActionDBv1): IExplosiveObjectActionDB => {
    const v = v1Tov2(prev);

    return {
        ...prev,
        ...v,
    };
};

export const explosiveObject = {
    v1Tov2,
};

export const explosiveObjectAction = {
    v1Tov2: actionV1Tov2,
};
