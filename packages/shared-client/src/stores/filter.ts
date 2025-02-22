import { type EXPLOSIVE_OBJECT_COMPONENT, EXPLOSIVE_OBJECT_STATUS } from 'shared-my';

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

export const getDictionaryFilter = (self: ISelf, component?: EXPLOSIVE_OBJECT_COMPONENT) => {
    if (self?.getStores()?.viewer?.user?.isAuthor)
        return component
            ? {
                  where: {
                      component: component,
                  },
              }
            : {};

    if (!self?.getStores()?.viewer?.user?.data?.organization?.id) {
        return {
            where: {
                status: EXPLOSIVE_OBJECT_STATUS.CONFIRMED,
                component: component,
            },
        };
    }

    return {
        or: [
            {
                status: EXPLOSIVE_OBJECT_STATUS.CONFIRMED,
                component: component,
            },
            {
                organizationId: self.getStores()?.viewer?.user?.data?.organization?.id,
                status: { '!=': EXPLOSIVE_OBJECT_STATUS.CONFIRMED },
                component: component,
            },
        ],
    };
};
