import { EquipmentActionValue, IEquipmentActionValue } from './equipment-action.schema';
import { Equipment, IEquipment } from '../equipment/equipment';

export interface IEquipmentAction extends IEquipmentActionValue {
    updateFields: (data: Partial<IEquipmentActionValue>) => void;
    equipment: IEquipment;
}

export class EquipmentAction extends EquipmentActionValue {
    constructor(data: IEquipmentActionValue) {
        super(data);
    }

    updateFields(data: Partial<IEquipmentActionValue>) {
        Object.assign(this, data);
    }

    get equipment() {
        return new Equipment(this);
    }
}
