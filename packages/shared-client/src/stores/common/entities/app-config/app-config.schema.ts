import { type IAppConfigDTO } from '~/api';

export interface IAppConfigData {
    config: {
        version: {
            number: string;
            force: boolean;
        };
        links: {
            appStore?: string;
            playMarket?: string;
        };
    };
}

export const createAppConfig = (dto?: IAppConfigDTO): IAppConfigData => ({
    config: {
        version: {
            number: dto?.config?.version?.number ?? '',
            force: dto?.config?.version?.force ?? false,
        },
        links: {
            appStore: dto?.config?.links?.appStore,
            playMarket: dto?.config?.links?.playMarket,
        },
    },
});
