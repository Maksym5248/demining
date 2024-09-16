import {
    type IExplosiveObjectDBv1,
    type IExplosiveObjectDB,
    type IExplosiveObjectActionDBv1,
    type IExplosiveObjectActionDB,
    EXPLOSIVE_OBJECT_STATUS,
    EXPLOSIVE_OBJECT_COMPONENT,
    countries,
} from 'shared-my';

export const v1Tov2 = (prev: IExplosiveObjectDBv1): IExplosiveObjectDB => {
    const v: IExplosiveObjectDB = {
        id: prev.id,
        createdAt: prev.createdAt,
        updatedAt: prev.updatedAt,
        name: prev.name,
        typeId: prev.typeId,
        groupId: null,
        countryId: countries[0].id,
        classIds: [],
        status: EXPLOSIVE_OBJECT_STATUS.PENDING,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        imageUri: null,
        details: {
            purpose: null,
            temperatureRange: null,
            body: null,
            size: null,
            structure: null,
            action: null,
            marking: [],
            neutralization: null,
            weight: [],
            caliber: prev.caliber ?? null,
            fuseIds: [],
            liquidator: null,
            reduction: null,
        },
    };

    if (prev.authorId) v.authorId = prev.authorId;
    if (prev._search) v._search = prev._search;

    return v;
};

export const actionV1Tov2 = (prev: IExplosiveObjectActionDBv1): IExplosiveObjectActionDB => {
    const v = v1Tov2(prev);

    const newValue = { ...prev };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (newValue.typeId) delete newValue.typeId;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (newValue.caliber) delete newValue.caliber;

    return {
        ...newValue,
        ...v,
    };
};
