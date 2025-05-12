import { makeAutoObservable } from 'mobx';
import {
    type IBookData,
    type IBook,
    type IExplosive,
    type IExplosiveDevice,
    type IExplosiveObject,
    RequestModel,
    delay,
} from 'shared-my-client';

import { SCREENS } from '~/constants';
import { BookCache, Navigation } from '~/services';

export type Item = IExplosive | IExplosiveObject | IExplosiveDevice;

export enum STATUS {
    UNKNOWN = 'UNKNOWN',
    IDDLE = 'IDDLE',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    LOADED = 'LOADED',
}

export interface IDataItem {
    id: string;
    data: IBookData;
    imageUri: string;
    displayName: string;
    typeNames: string[];
    checkLoaded: RequestModel;
    load: RequestModel;
    progress: number;
    status: STATUS;
    openItem(): void;
    isLoaded: boolean;
}

export class DataItem implements IDataItem {
    status = STATUS.UNKNOWN;
    bytesRead = 0;
    bytesTotal = 0;

    constructor(public item: IBook) {
        makeAutoObservable(this);
    }

    openItem() {
        Navigation.push(SCREENS.READER, {
            uri: BookCache.getLocalPath(this.data.uri),
            title: this.displayName,
        });
    }

    setStatus(status: STATUS) {
        this.status = status;
    }

    checkLoaded = new RequestModel({
        run: async () => {
            const exist = await BookCache.exists(this.data.uri);
            this.setStatus(exist ? STATUS.LOADED : STATUS.IDDLE);
        },
        onError: () => this.setStatus(STATUS.IDDLE),
    });

    onProgress = (bytesRead: number, contentLength: number) => {
        this.bytesRead = bytesRead;
        this.bytesTotal = contentLength;
    };

    load = new RequestModel({
        run: async () => {
            this.setStatus(STATUS.LOADING);
            await delay(50);
            await BookCache.download(this.data.uri, (bytesRead: number, contentLength: number) => {
                this.onProgress(bytesRead, contentLength);
            });
            this.onProgress(this.bytesTotal, this.bytesTotal);
            await delay(500);
            this.setStatus(STATUS.SUCCESS);
            await delay(1000);
            this.setStatus(STATUS.LOADED);
        },
    });

    get imageUri() {
        return this.item.data.imageUri;
    }

    get data() {
        return this.item.data;
    }

    get displayName() {
        return this.item.displayName;
    }

    get id() {
        return this.item.id;
    }

    get typeNames() {
        return this.item?.types?.map(el => el.name) ?? [];
    }

    get progress() {
        return this.bytesTotal ? this.bytesRead / this.bytesTotal : 0;
    }

    get isLoaded() {
        return this.status === STATUS.LOADED || this.status === STATUS.SUCCESS;
    }
}
