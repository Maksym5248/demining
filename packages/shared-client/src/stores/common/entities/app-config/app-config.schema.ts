import { type PlatformType } from 'shared-my';

import { type IVersionDTO, type IAppConfigDTO } from '~/api';

export interface IVersionData {
    number: string;
    force: boolean;
    link: string;
}

export interface IAppConfigData {
    config: {
        version: IVersionData;
    };
}

export const createVersion = (dto?: IVersionDTO): IVersionData => ({
    number: dto?.number ?? '0.0.0',
    force: dto?.force ?? false,
    link: dto?.link ?? '',
});

export const createAppConfig = (platform: PlatformType, dto?: IAppConfigDTO): IAppConfigData => ({
    config: {
        version: createVersion(dto?.config?.platform[platform].version),
    },
});
