import { message } from 'antd';

import { type IExplosiveAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { RequestModel } from '~/models';

import { type IExplosiveValue, updateExplosiveDTO, createExplosive, ExplosiveValue } from './explosive.schema';

export interface IExplosive extends IExplosiveValue {
    update: RequestModel<[IUpdateValue<IExplosiveValue>]>;
}

interface IApi {
    explosive: IExplosiveAPI;
}

export class Explosive extends ExplosiveValue implements IExplosive {
    api: IApi;

    constructor(data: IExplosiveValue, params: { api: IApi }) {
        super(data);
        this.api = params.api;
    }

    updateFields(data: Partial<IExplosiveValue>) {
        Object.assign(this, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IExplosiveValue>) => {
            const res = await this.api.explosive.update(this.id, updateExplosiveDTO(data));

            this.updateFields(createExplosive(res));
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });
}
