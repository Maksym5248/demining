import { Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { UpdateValue } from '~/types'
import { Api } from '~/api'

import { types } from '../../../../types'
import { asyncAction } from '../../../../utils';
import { IMissionRequestValue, updateMissionRequestDTO, createMissionRequest } from './mission-request.schema';

export type IMissionRequest = Instance<typeof MissionRequest>

const Entity = types.model('MissionRequest', {
  id: types.identifier,
  signedAt: types.dayjs,
  number: types.number,
  createdAt: types.dayjs,
  updatedAt: types.dayjs,
}).actions((self) => ({
  updateFields(data: Partial<IMissionRequestValue>) {
      Object.assign(self, data);
  }
}));


const update = asyncAction<Instance<typeof Entity>>((data: UpdateValue<IMissionRequestValue>) => {
  return async function addEmployeeFlow({ flow, self }) {
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
      flow.failed(err)
      message.error('Не вдалось додати');
    }
  };
});

export const MissionRequest = Entity.props({ update });