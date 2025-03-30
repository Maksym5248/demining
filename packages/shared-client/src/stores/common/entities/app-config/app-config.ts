import { makeAutoObservable } from 'mobx';
import { type PlatformType } from 'shared-my';

import { type IAppConfigData } from './app-config.schema';

export interface IAppConfig {
    platform?: PlatformType;
    data: IAppConfigData | null;
    version: string;
    link: string;
    force: boolean;
    setPlatform(platform: PlatformType): void;
    set(data: IAppConfigData): void;
    checkDebugger(uuid?: string): boolean;
}

export class AppConfig implements IAppConfig {
    data: IAppConfigData | null = null;
    platform?: PlatformType;

    constructor() {
        makeAutoObservable(this);
    }

    parceVersion(version?: string) {
        return version?.split('.').map(Number);
    }

    setPlatform(platform: PlatformType) {
        this.platform = platform;
    }

    checkDebugger(uuid?: string) {
        return uuid ? !!this.data?.config.debuggers?.includes(uuid) : false;
    }

    get force() {
        return !!this.data?.config.version.force;
    }

    get version() {
        return this.data?.config?.version?.number ?? '';
    }

    get link() {
        return this.data?.config.version.link ?? '';
    }

    set(data: IAppConfigData) {
        this.data = data;
    }
}
