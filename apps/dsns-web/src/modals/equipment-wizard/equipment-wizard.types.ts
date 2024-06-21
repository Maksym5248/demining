import { type EQUIPMENT_TYPE } from 'shared-my/db';

export interface IEquipmentForm {
    name: string;
    type: EQUIPMENT_TYPE;
}
