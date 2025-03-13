import { type IExplosiveObjectDB, type IExplosiveObjectDetailsDB } from 'shared-my';

export interface IExplosiveObjectDBPrev extends IExplosiveObjectDB {
    details: Omit<IExplosiveObjectDetailsDB, 'id' | 'createdAt' | 'updatedAt' | 'status'>;
}

export const v2Tov3 = ({
    details,
    ...prev
}: IExplosiveObjectDBPrev): {
    explosiveObject: IExplosiveObjectDB;
    explosiveObjectDetails: IExplosiveObjectDetailsDB;
} => {
    const v: IExplosiveObjectDB = { ...prev };

    const explosiveObjectDetails = {
        ...details,
        id: v.id,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
        status: v.status,
        organizationId: v.organizationId ?? null,
    };

    if (v.authorId) {
        explosiveObjectDetails.authorId = v.authorId;
    }

    return {
        explosiveObject: { ...v },
        explosiveObjectDetails: explosiveObjectDetails,
    };
};
