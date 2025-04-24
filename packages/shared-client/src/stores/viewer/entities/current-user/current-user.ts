import { makeAutoObservable } from 'mobx';

import { type ICurrentUserData } from './current-user.schema';

export interface ICurrentUser {
    data: ICurrentUserData;
    id: string;
    displayName: string | undefined;
}

export class CurrentUser implements ICurrentUser {
    data: ICurrentUserData;

    constructor(data: ICurrentUserData) {
        this.data = data;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    get displayName() {
        return this.data.info?.name || this.data.info?.email;
    }
}
