import { Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { UpdateValue } from '~/types'
import { Api } from '~/api'
import { TRANSPORT_TYPE } from '~/constants'

import { types } from '../../../../types'
import { asyncAction } from '../../../../utils';
import { ITransportValue, updateTransportDTO, createTransport } from './transport.schema';

export type ITransport = Instance<typeof Transport>

const Entity = types.model('Transport', {
  id: types.identifier,
  name: types.string,
  type: types.enumeration(Object.values(TRANSPORT_TYPE)),
  number: types.string,
  createdAt: types.dayjs,
  updatedAt: types.dayjs,
}).actions((self) => ({
  updateFields(data: Partial<ITransportValue>) {
      Object.assign(self, data);
  }
}));


const update = asyncAction<Instance<typeof Entity>>((data: UpdateValue<ITransportValue>) => async function addEmployeeFlow({ flow, self }) {
    try {
      flow.start();

      const res = await Api.transport.update(self.id, updateTransportDTO(data));    

      self.updateFields(createTransport(res));

      message.success({
        type: 'success',
        content: 'Збережено успішно',
      });
      flow.success();
    } catch (err) {
      flow.failed(err)
      message.error('Не вдалось додати');
    }
  });

export const Transport = Entity.props({ update });