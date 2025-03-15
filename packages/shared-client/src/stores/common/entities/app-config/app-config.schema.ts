import { type IAppConfigDTO } from '~/api';

export interface IAppConfigData {
    config: {
        version: {
            number: string;
            build: number;
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
            build: dto?.config?.version?.build ?? 0,
            force: dto?.config?.version?.force ?? false,
        },
        links: {
            appStore: dto?.config?.links?.appStore,
            playMarket: dto?.config?.links?.playMarket,
        },
    },
});
