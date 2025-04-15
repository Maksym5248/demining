import { type IBaseDB } from './common';

export interface IVersionDB {
    number: string;
    force: boolean;
    link: string;
}

export type PlatformType = 'ios' | 'android' | 'windows' | 'macos' | 'web';

export interface IPlatformConfigDB {
    version: IVersionDB;
}

export interface IAppConfigDB extends IBaseDB {
    config: {
        debuggers?: string[];
        platform: Record<PlatformType, IPlatformConfigDB>;
    };
}
