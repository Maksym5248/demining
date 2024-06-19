import { missionRequestType } from '@/shared/db';
import { message } from 'antd';

import { type IMissionRequestAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { RequestModel } from '~/models';

import { type IMissionRequestValue, updateMissionRequestDTO, createMissionRequest, MissionRequestValue } from './mission-request.schema';

export interface IMissionRequest extends IMissionRequestValue {
    update: RequestModel<[IUpdateValue<IMissionRequestValue>]>;
    displayType?: string;
    displayValue: string;
}

interface IApi {
    missionRequest: IMissionRequestAPI;
}

export class MissionRequest extends MissionRequestValue implements IMissionRequest {
    api: IApi;

    constructor(value: IMissionRequestValue, params: { api: IApi }) {
        super(value);
        this.api = params.api;
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
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });
}
