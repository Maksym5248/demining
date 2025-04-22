import { makeAutoObservable } from 'mobx';
import { missionRequestType } from 'shared-my';

import { type IMissionRequestAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type IDataModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IMissionRequestData, updateMissionRequestDTO, createMissionRequest } from './mission-request.schema';

export interface IMissionRequest extends IDataModel<IMissionRequestData> {
    update: RequestModel<[IUpdateValue<IMissionRequestData>]>;
    displayType?: string;
    displayValue: string;
}

interface IApi {
    missionRequest: IMissionRequestAPI;
}

interface IServices {
    message: IMessage;
}

export class MissionRequest implements IMissionRequest {
    api: IApi;
    services: IServices;
    data: IMissionRequestData;

    constructor(data: IMissionRequestData, params: { api: IApi; services: IServices }) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    updateFields(data: Partial<IMissionRequestData>) {
        Object.assign(this.data, data);
    }

    get displayType() {
        return missionRequestType.find(el => el.id === this.data.type)?.name;
    }

    get displayValue() {
        return `${this.displayType} №${this.data.number} ${this.data.signedAt.format('DD/MM/YYYY')}`;
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IMissionRequestData>) => {
            const res = await this.api.missionRequest.update(this.data.id, updateMissionRequestDTO(data));
            this.updateFields(createMissionRequest(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
