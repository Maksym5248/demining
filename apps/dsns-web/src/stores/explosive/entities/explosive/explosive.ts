import { message } from 'antd';

import { Api } from '~/api';
import { type UpdateValue } from '~/types';
import { RequestModel } from '~/utils/models';

import { type IExplosiveValue, updateExplosiveDTO, createExplosive, ExplosiveValue } from './explosive.schema';

export interface IExplosive extends IExplosiveValue {
    update: RequestModel<[UpdateValue<IExplosiveValue>]>;
}

export class Explosive extends ExplosiveValue implements IExplosive {
    constructor(data: IExplosiveValue) {
        super(data);
    }

    updateFields(data: Partial<IExplosiveValue>) {
        Object.assign(this, data);
    }

    update = new RequestModel({
        run: async (data: UpdateValue<IExplosiveValue>) => {
            const res = await Api.explosive.update(this.id, updateExplosiveDTO(data));

            this.updateFields(createExplosive(res));
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });
}
