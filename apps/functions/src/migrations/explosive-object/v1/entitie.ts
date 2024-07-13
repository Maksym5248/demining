import {
    type IExplosiveObjectDBv1,
    type IExplosiveObjectDB,
    type IExplosiveObjectActionDBv1,
    type IExplosiveObjectActionDB,
    EXPLOSIVE_OBJECT_STATUS,
    EXPLOSIVE_OBJECT_GROUP,
} from 'shared-my/db';

export const v1Tov2 = (prev: IExplosiveObjectDBv1): IExplosiveObjectDB => {
    const v: IExplosiveObjectDB = {
        id: prev.id,
        createdAt: prev.createdAt,
        updatedAt: prev.updatedAt,
        name: prev.name,
        detailsId: null,
        status: EXPLOSIVE_OBJECT_STATUS.PENDING,
        meta: {
            copy: {
                group: EXPLOSIVE_OBJECT_GROUP.AMMO,
                typeIds: [],
                caliber: prev.caliber ?? null,
            },
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
