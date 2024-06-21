import { missionRequestType } from 'shared-my/db';

import { type IMissionRequestAPI } from '~/api';
import { customMakeAutoObservable, type IUpdateValue } from '~/common';
import { RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IMissionRequestValue, updateMissionRequestDTO, createMissionRequest, MissionRequestValue } from './mission-request.schema';

export interface IMissionRequest extends IMissionRequestValue {
    update: RequestModel<[IUpdateValue<IMissionRequestValue>]>;
    displayType?: string;
    displayValue: string;
}

interface IApi {
    missionRequest: IMissionRequestAPI;
}

interface IServices {
    message: IMessage;
}

export class MissionRequest extends MissionRequestValue implements IMissionRequest {
    api: IApi;
    services: IServices;

    constructor(value: IMissionRequestValue, params: { api: IApi; services: IServices }) {
        super(value);
        this.api = params.api;
        this.services = params.services;

        customMakeAutoObservable(this);
    }

    updateFields(data: Partial<IMissionRequestValue>) {
        Object.assign(self, data);
    }

    get displayType() {
        return missionRequestType.find((el) => el.value === this.type)?.name;
    }

    get displayValue() {
        return `${this.displayType} №${this.number} ${this.signedAt.format('DD/MM/YYYY')}`;
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IMissionRequestValue>) => {
            const res = await this.api.missionRequest.update(this.id, updateMissionRequestDTO(data));
            this.updateFields(createMissionRequest(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
