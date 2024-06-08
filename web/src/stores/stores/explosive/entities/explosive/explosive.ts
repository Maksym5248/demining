import { message } from 'antd';
import { Instance } from 'mobx-state-tree';

import { Api } from '~/api';
import { EXPLOSIVE_TYPE } from '~/constants/db/explosive-type';
import { UpdateValue } from '~/types';

import { IExplosiveValue, updateExplosiveDTO, createExplosive } from './explosive.schema';
import { types } from '../../../../types';
import { asyncAction } from '../../../../utils';

export type IExplosive = Instance<typeof Explosive>;

const Entity = types
    .model('Explosive', {
        id: types.identifier,
        type: types.enumeration(Object.values(EXPLOSIVE_TYPE)),
        name: types.string,
        createdAt: types.dayjs,
        updatedAt: types.dayjs,
    })
    .actions((self) => ({
        updateFields(data: Partial<IExplosiveValue>) {
            Object.assign(self, data);
        },
    }));

const update = asyncAction<Instance<typeof Entity>>(
    (data: UpdateValue<IExplosiveValue>) =>
        async function fn({ flow, self }) {
            try {
                flow.start();

                const res = await Api.explosive.update(self.id, updateExplosiveDTO(data));

                self.updateFields(createExplosive(res));

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

export const Explosive = Entity.props({ update });
