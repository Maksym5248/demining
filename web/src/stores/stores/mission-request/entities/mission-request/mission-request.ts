import { message } from 'antd';
import { Instance } from 'mobx-state-tree';

import { Api } from '~/api';
import { MISSION_REQUEST_TYPE } from '~/constants';
import { missionRequestType } from '~/data';
import { UpdateValue } from '~/types';

import {
    IMissionRequestValue,
    updateMissionRequestDTO,
    createMissionRequest,
} from './mission-request.schema';
import { types } from '../../../../types';
import { asyncAction } from '../../../../utils';

export type IMissionRequest = Instance<typeof MissionRequest>;

const Entity = types
    .model('MissionRequest', {
        id: types.identifier,
        signedAt: types.dayjs,
        number: types.string,
        type: types.enumeration(Object.values(MISSION_REQUEST_TYPE)),
        createdAt: types.dayjs,
        updatedAt: types.dayjs,
    })
    .actions((self) => ({
        updateFields(data: Partial<IMissionRequestValue>) {
            Object.assign(self, data);
        },
    }))
    .views((self) => ({
        get displayType() {
            return missionRequestType.find((el) => el.value === self.type)?.name;
        },
    }))
    .views((self) => ({
        get displayValue() {
            return `${self.displayType} №${self.number} ${self.signedAt.format('DD/MM/YYYY')}`;
        },
    }));

const update = asyncAction<Instance<typeof Entity>>(
    (data: UpdateValue<IMissionRequestValue>) =>
        async function fn({ flow, self }) {
            try {
                flow.start();

                const res = await Api.missionRequest.update(self.id, updateMissionRequestDTO(data));

                self.updateFields(createMissionRequest(res));

                message.success({
                    type: 'success',
                    content: 'Збережено успішно',
                });
                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Не вдалось додати');
            }
        },
);

export const MissionRequest = Entity.props({ update });
