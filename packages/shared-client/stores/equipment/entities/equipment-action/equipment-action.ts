import { type IEquipmentAPI } from '~/api';

import { EquipmentActionValue, type IEquipmentActionValue } from './equipment-action.schema';
import { Equipment, type IEquipment } from '../equipment/equipment';

export interface IEquipmentAction extends IEquipmentActionValue {
    updateFields: (data: Partial<IEquipmentActionValue>) => void;
    equipment: IEquipment;
}

interface IApi {
    equipment: IEquipmentAPI;
}

interface IEquipmentActionParams {
    api: IApi;
}

export class EquipmentAction extends EquipmentActionValue {
    api: Pick<IApi, 'equipment'>;

    constructor(data: IEquipmentActionValue, params: IEquipmentActionParams) {
        super(data);
        this.api = params.api;
    }

    updateFields(data: Partial<IEquipmentActionValue>) {
        Object.assign(this, data);
    }

    get equipment() {
        return new Equipment(this, this);
    }
}
