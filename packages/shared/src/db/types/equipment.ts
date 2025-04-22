import { type IBaseDB, type ILinkedToDocumentDB } from './common';
import { type EQUIPMENT_TYPE } from '../enum';

export interface IEquipmentDB extends IBaseDB {
    name: string;
    type: EQUIPMENT_TYPE;
    authorId: string;
}

export interface IEquipmentActionDB extends IEquipmentDB, ILinkedToDocumentDB {
    equipmentId: string;
}
