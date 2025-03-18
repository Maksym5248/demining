import { makeAutoObservable } from 'mobx';
import { type PlatformType } from 'shared-my';

import { type IAppConfigData } from './app-config.schema';

export interface IAppConfig {
    platform?: PlatformType;
    data: IAppConfigData | null;
    version: {
        major: number;
        minor: number;
        bugfix: number;
    };
    link: string;
    force: boolean;
    isAvalibaleUpdate(version: string): boolean;
    setPlatform(platform: PlatformType): void;
    set(data: IAppConfigData): void;
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

    get force() {
        return !!this.data?.config.version.force;
    }

    get version() {
        const [major, minor, bugfix] = this.parceVersion(this.data?.config.version.number) ?? [0, 0, 0];

        return {
            major,
            minor,
            bugfix,
        };
    }

    get link() {
        return this.data?.config.version.link ?? '';
    }

    isAvalibaleUpdate(version: string) {
        const { major, minor, bugfix } = this.version;
        const [currentMajor, currentMinor, currentBugfix] = this.parceVersion(version) ?? [0, 0, 0];

        return major > currentMajor || minor > currentMinor || bugfix > currentBugfix;
    }

    set(data: IAppConfigData) {
        this.data = data;
    }
}
