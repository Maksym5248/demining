import { makeAutoObservable } from 'mobx';
import { type ROLES } from 'shared-my';

import { type IDataModel } from '~/models';

import { type IUserData } from './user.schema';

export interface IUser extends IDataModel<IUserData> {
    hasRole(role: ROLES): boolean;
}

export class User implements IUser {
    data: IUserData;

    constructor(data: IUserData) {
        this.data = data;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    hasRole(role: ROLES) {
        return this.data.roles.includes(role);
    }
}
