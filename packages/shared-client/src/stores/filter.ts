import { type EXPLOSIVE_OBJECT_COMPONENT, APPROVE_STATUS } from 'shared-my';

interface ISelf {
    getStores: () => {
        viewer?: {
            permissions: {
                dictionary: {
                    edit: () => boolean;
                    viewManagement: () => boolean;
                };
            };
            user?: {
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
    if (self?.getStores()?.viewer?.permissions?.dictionary.viewManagement()) {
        return component
            ? {
                  where: {
                      component: component,
                  },
              }
            : {};
    }

    // Is this valid case?
    if (!self?.getStores()?.viewer?.user?.data?.organization?.id) {
        return {
            where: {
                status: APPROVE_STATUS.CONFIRMED,
                component: component,
            },
        };
    }

    return {
        or: [
            {
                status: APPROVE_STATUS.CONFIRMED,
                component: component,
            },
            {
                organizationId: self.getStores()?.viewer?.user?.data?.organization?.id,
                status: { '!=': APPROVE_STATUS.CONFIRMED },
                component: component,
            },
        ],
    };
};

export const getDictionarySync = (self: ISelf) => {
    if (self?.getStores()?.viewer?.permissions?.dictionary.viewManagement()) {
        return {};
    }

    return {
        where: {
            status: APPROVE_STATUS.CONFIRMED,
        },
    };
};
