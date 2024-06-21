import { type IEquipmentAPI } from '~/api';

import { EquipmentActionValue, type IEquipmentActionValue } from './equipment-action.schema';
import { Equipment, type IEquipment } from '../equipment/equipment';
import { IMessage } from '~/services';

export interface IEquipmentAction extends IEquipmentActionValue {
    updateFields: (data: Partial<IEquipmentActionValue>) => void;
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

export class EquipmentAction extends EquipmentActionValue {
    api: IApi;
    services: IServices;

    constructor(data: IEquipmentActionValue, params: IEquipmentActionParams) {
        super(data);
        this.api = params.api;
        this.services = params.services;
    }

    updateFields(data: Partial<IEquipmentActionValue>) {
        Object.assign(this, data);
    }

    get equipment() {
        return new Equipment(this, this);
    }
}
