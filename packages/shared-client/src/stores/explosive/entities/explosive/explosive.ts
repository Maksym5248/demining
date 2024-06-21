
import { type IExplosiveAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { RequestModel } from '~/models';

import { type IExplosiveValue, updateExplosiveDTO, createExplosive, ExplosiveValue } from './explosive.schema';
import { IMessage } from '~/services';

export interface IExplosive extends IExplosiveValue {
    update: RequestModel<[IUpdateValue<IExplosiveValue>]>;
}

interface IApi {
    explosive: IExplosiveAPI;
}

interface IServices {
    message: IMessage;
}

export class Explosive extends ExplosiveValue implements IExplosive {
    api: IApi;
    services: IServices;

    constructor(data: IExplosiveValue, params: { api: IApi, services: IServices }) {
        super(data);
        this.api = params.api;
        this.services = params.services;
    }

    updateFields(data: Partial<IExplosiveValue>) {
        Object.assign(this, data);
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IExplosiveValue>) => {
            const res = await this.api.explosive.update(this.id, updateExplosiveDTO(data));

            this.updateFields(createExplosive(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
