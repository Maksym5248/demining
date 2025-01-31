import { EXPLOSIVE_OBJECT_STATUS } from 'shared-my';

interface ISelf {
    getStores: () => {
        viewer?: {
            user?: {
                isAuthor: boolean;
                data?: {
                    organization?: {
                        id: string;
                    } | null;
                } | null;
            } | null;
        };
    } | null;
}

export const getDictionaryFilter = (self: ISelf) => {
    if (self?.getStores()?.viewer?.user?.isAuthor) return {};

    if (!self?.getStores()?.viewer?.user?.data?.organization?.id) {
        return {
            where: {
                status: EXPLOSIVE_OBJECT_STATUS.CONFIRMED,
            },
        };
    }

    return {
        or: [
            {
                status: EXPLOSIVE_OBJECT_STATUS.CONFIRMED,
            },
            {
                organizationId: self.getStores()?.viewer?.user?.data?.organization?.id,
                status: { '!=': EXPLOSIVE_OBJECT_STATUS.CONFIRMED },
            },
        ],
    };
};
