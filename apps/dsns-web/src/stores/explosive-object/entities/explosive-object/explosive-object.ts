import { type UpdateValue, type ICollectionModel, RequestModel } from '@/shared-client';
import { message } from 'antd';

import { Api } from '~/api';

import {
    type IExplosiveObjectValueParams,
    ExplosiveObjectValue,
    updateExplosiveObjectDTO,
    createExplosiveObject,
    type IExplosiveObjectValue,
} from './explosive-object.schema';
import { type ExplosiveObjectType, type ExplosiveObjectTypeValue } from '../explosive-object-type';

interface IExplosiveObjectParams {
    collections: {
        type: ICollectionModel<ExplosiveObjectType, ExplosiveObjectTypeValue>;
    };
}

export interface IExplosiveObject extends IExplosiveObjectValue {
    type?: ExplosiveObjectType;
    collectionType: ICollectionModel<ExplosiveObjectType, ExplosiveObjectTypeValue>;
    displayName: string;
    fullDisplayName: string;
    update: RequestModel<[UpdateValue<IExplosiveObjectValueParams>]>;
}

export class ExplosiveObject extends ExplosiveObjectValue implements IExplosiveObject {
    collectionType: ICollectionModel<ExplosiveObjectType, ExplosiveObjectTypeValue>;

    constructor(data: IExplosiveObjectValueParams, { collections }: IExplosiveObjectParams) {
        super(data);
        this.collectionType = collections.type;
    }

    updateFields(data: UpdateValue<IExplosiveObjectValueParams>) {
        Object.assign(self, data);
    }

    get type() {
        return this.collectionType.get(this.typeId);
    }

    get displayName() {
        return `${self.name ?? ''}${self.name && this.caliber ? '  -  ' : ''}${this.caliber ? this.caliber : ''}`;
    }

    get fullDisplayName() {
        return `${this.type?.name}${this.displayName ? ' -  ' : ''}${this.displayName}`;
    }

    update = new RequestModel({
        run: async (data: UpdateValue<IExplosiveObjectValueParams>) => {
            const res = await Api.explosiveObject.update(this.id, updateExplosiveObjectDTO(data));

            this.updateFields(createExplosiveObject(res));
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });
}
