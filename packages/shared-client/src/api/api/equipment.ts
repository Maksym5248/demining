import { type IEquipmentDB } from 'shared-my';

import { type IQuery, type IDBBase, type ICreateValue, type IUpdateValue } from '~/common';

import { type IEquipmentDTO } from '../dto';

export interface IEquipmentAPI {
    create(value: ICreateValue<IEquipmentDTO>): Promise<IEquipmentDTO>;
    update(id: string, value: IUpdateValue<IEquipmentDTO>): Promise<IEquipmentDTO>;
    remove(id: string): Promise<string>;
    getList(query?: IQuery): Promise<IEquipmentDTO[]>;
    get(id: string): Promise<IEquipmentDTO>;
}

export class EquipmentAPI implements IEquipmentAPI {
    constructor(
        private db: {
            equipment: IDBBase<IEquipmentDB>;
        },
    ) {}

    create(value: ICreateValue<IEquipmentDTO>): Promise<IEquipmentDTO> {
        return this.db.equipment.create(value);
    }
    update(id: string, value: IUpdateValue<IEquipmentDTO>): Promise<IEquipmentDTO> {
        return this.db.equipment.update(id, value);
    }
    remove(id: string) {
        return this.db.equipment.remove(id);
    }

    getList(query?: IQuery): Promise<IEquipmentDTO[]> {
        return this.db.equipment.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });
    }

    async get(id: string): Promise<IEquipmentDTO> {
        const res = await this.db.equipment.get(id);
        if (!res) throw new Error('there is equipment with id');
        return res;
    }
}
