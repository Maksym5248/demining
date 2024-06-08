import { message } from 'antd';
import { Instance } from 'mobx-state-tree';

import { Api, ICreateOrganizationDTO } from '~/api';
import { IUser, User, createUser } from '~/stores/stores/user';
import { asyncAction, createList, safeReference } from '~/stores/utils';

import {
    IOrganizationValue,
    createOrganization,
    createOrganizationDTO,
} from './organization.schema';
import { types } from '../../../../types';

export type IOrganization = Instance<typeof Organization>;

const Entity = types
    .model('Organization', {
        id: types.identifier,
        name: types.string,
        members: createList<IUser>('MembersList', safeReference(User), { pageSize: 10 }),
        createdAt: types.dayjs,
        updatedAt: types.dayjs,
    })
    .actions((self) => ({
        updateFields(data: Omit<Partial<IOrganizationValue>, 'members'>) {
            Object.assign(self, data);
        },
    }));

const update = asyncAction<Instance<typeof Entity>>(
    (data: ICreateOrganizationDTO) =>
        async function fn({ flow, self }) {
            try {
                flow.start();

                const res = await Api.organization.update(self.id, createOrganizationDTO(data));

                self.updateFields(createOrganization(res));

                message.success('Збережено успішно');
                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Не вдалось додати');
            }
        },
);

const createMember = asyncAction<Instance<typeof Entity>>(
    (userId: string, isAdmin: boolean) =>
        async function fn({ flow, root, self }) {
            try {
                const res = await Api.organization.updateMember(
                    self.id,
                    userId,
                    isAdmin,
                    !!root.viewer.user?.isRootAdmin,
                );
                const member = createUser(res);
                root.user.collection.set(member.id, member);
                self.members.push(member.id);

                message.success('Збережено успішно');
                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Не вдалось додати');
            }
        },
);

const updateMember = asyncAction<Instance<typeof Entity>>(
    (userId: string, isAdmin: boolean) =>
        async function fn({ flow, root, self }) {
            try {
                const res = await Api.organization.updateMember(
                    self.id,
                    userId,
                    isAdmin,
                    !!root.viewer.user?.isRootAdmin,
                );
                const member = createUser(res);

                root.user.collection.update(member.id, member);

                message.success('Збережено успішно');
                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Не вдалось додати');
            }
        },
);

const removeMember = asyncAction<Instance<typeof Entity>>(
    (userId: string) =>
        async function fn({ flow, root, self }) {
            try {
                flow.start();
                await Api.organization.removeMember(self.id, userId);

                self.members.removeById(userId);
                root.user.collection.remove(userId);

                message.success('Збережено успішно');
                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Не вдалось додати');
            }
        },
);

const fetchMembers = asyncAction<Instance<typeof Entity>>(
    () =>
        async function fn({ flow, self, root }) {
            if (flow.isLoaded) {
                return;
            }

            try {
                flow.start();
                const res = await Api.organization.getMembers(self.id);

                res.forEach((value) => {
                    const member = createUser(value);

                    root.user.collection.set(member.id, member);
                    self.members.push(member.id);
                });

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Виникла помилка');
            }
        },
);

export const Organization = Entity.props({
    update,
    createMember,
    removeMember,
    updateMember,
    fetchMembers,
});
