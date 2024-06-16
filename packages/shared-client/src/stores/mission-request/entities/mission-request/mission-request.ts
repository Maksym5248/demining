import { message } from 'antd';

import { type UpdateValue } from '@/shared-client';
import { RequestModel } from '@/shared-client';
import { Api } from '~/api';
import { missionRequestType } from '~/data';

import {
    type IMissionRequestValue,
    updateMissionRequestDTO,
    createMissionRequest,
    MissionRequestValue,
} from './mission-request.schema';

export interface IMissionRequest extends IMissionRequestValue {
    update: RequestModel<[UpdateValue<IMissionRequestValue>]>;
    displayType?: string;
    displayValue: string;
}

export class MissionRequest extends MissionRequestValue implements IMissionRequest {
    constructor(value: IMissionRequestValue) {
        super(value);
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
        run: async (data: UpdateValue<IMissionRequestValue>) => {
            const res = await Api.missionRequest.update(this.id, updateMissionRequestDTO(data));
            this.updateFields(createMissionRequest(res));
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });
}
