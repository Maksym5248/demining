import { Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { UpdateValue } from '~/types'
import { Api } from '~/api'

import { types } from '../../../../types'
import { asyncAction } from '../../../../utils';
import { IExplosiveObjectTypeValue, updateExplosiveObjectTypeDTO, createExplosiveObjectType } from './explosive-object-type.schema';

export type IExplosiveObjectType = Instance<typeof ExplosiveObjectType>

const Entity = types.model('ExplosiveObjectType', {
	id: types.identifier,
	name: types.string,
	fullName: types.string,
	createdAt: types.dayjs,
	updatedAt: types.dayjs,
}).actions((self) => ({
	updateFields(data: Partial<IExplosiveObjectTypeValue>) {
		Object.assign(self, data);
	}
}));


const update = asyncAction<Instance<typeof Entity>>((data: UpdateValue<IExplosiveObjectTypeValue>) => async function addEmployeeFlow({ flow, self }) {
	try {
		flow.start();

		const res = await Api.explosiveObjectType.update(self.id, updateExplosiveObjectTypeDTO(data));    

		self.updateFields(createExplosiveObjectType(res));

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

export const ExplosiveObjectType = Entity.props({ update });