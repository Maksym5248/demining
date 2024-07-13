import {
    type IExplosiveObjectDBv2,
    type IExplosiveObjectDB,
    type IExplosiveObjectActionDB,
    EXPLOSIVE_OBJECT_STATUS,
    type IExplosiveObjectActionDBv2,
} from 'shared-my/db';

export const v2Tov3 = (prev: IExplosiveObjectDBv2): IExplosiveObjectDB => {
    const v: IExplosiveObjectDB = {
        id: prev.id,
        createdAt: prev.createdAt,
        updatedAt: prev.updatedAt,
        name: prev.name,
        detailsId: null,
        status: EXPLOSIVE_OBJECT_STATUS.PENDING,
        group: prev.meta.copy.group,
        typeIds: prev.meta.copy.typeIds,
    };

    if (prev.authorId) v.authorId = prev.authorId;
    if (prev._search) v._search = prev._search;

    return v;
};

export const actionV2Tov3 = (prev: IExplosiveObjectActionDBv2): IExplosiveObjectActionDB => {
    const v = v2Tov3(prev);

    const newValue = { ...prev };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (newValue.meta) delete newValue.caliber;

    return {
        ...newValue,
        ...v,
    };
};
