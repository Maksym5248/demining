import { makeAutoObservable } from 'mobx';

import { createAppConfig, type IAppConfigData } from './app-config.schema';

export interface IAppConfig {
    data: IAppConfigData;
    version: {
        major: number;
        minor: number;
        bugfix: number;
    };
    links: {
        appStore?: string;
        playMarket?: string;
    };
    force: boolean;
    isAvalibaleUpdate(version: string): boolean;
    set(data: IAppConfigData): void;
}

export class AppConfig implements IAppConfig {
    data: IAppConfigData = createAppConfig();

    constructor() {
        makeAutoObservable(this);
    }

    parceVersion(version: string) {
        return version.split('.').map(Number);
    }

    get force() {
        return this.data.config.version.force;
    }

    get version() {
        const [major, minor, bugfix] = this.parceVersion(this.data.config.version.number);

        return {
            major,
            minor,
            bugfix,
        };
    }

    get links() {
        return this.data.config.links;
    }

    isAvalibaleUpdate(version: string) {
        const { major, minor, bugfix } = this.version;
        const [currentMajor, currentMinor, currentBugfix] = this.parceVersion(version);

        return major > currentMajor || minor > currentMinor || bugfix > currentBugfix;
    }

    set(data: IAppConfigData) {
        this.data = data;
    }
}
