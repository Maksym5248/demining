import { makeAutoObservable } from 'mobx';

import { type IEquipmentAPI } from '~/api';
import { type IMessage } from '~/services';

import { type IEquipmentActionData } from './equipment-action.schema';
import { Equipment, type IEquipment } from '../equipment/equipment';

export interface IEquipmentAction {
    data: IEquipmentActionData;
    updateFields: (data: Partial<IEquipmentActionData>) => void;
    equipment: IEquipment;
}

interface IApi {
    equipment: IEquipmentAPI;
}

interface IServices {
    message: IMessage;
}

interface IEquipmentActionParams {
    api: IApi;
    services: IServices;
}

export class EquipmentAction implements IEquipmentAction {
    api: IApi;
    services: IServices;
    data: IEquipmentActionData;

    constructor(data: IEquipmentActionData, params: IEquipmentActionParams) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    updateFields(data: Partial<IEquipmentActionData>) {
        Object.assign(this.data, data);
    }

    get equipment() {
        return new Equipment(this.data, this);
    }
}
