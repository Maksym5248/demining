import { useEffect } from 'react';

import { Form, Drawer, Spin, Switch } from 'antd';
import { observer } from 'mobx-react-lite';
import { ROLES } from 'shared-my';

import { Select, WizardButtons, WizardFooter } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';

import { s } from './member-wizard.style';
import { type IMemberForm } from './member-wizard.types';

interface Props {
    id?: string;
    organizationId: string;
    isVisible: boolean;
    hide: () => void;
    mode: WIZARD_MODE;
}

export const MemberWizardModal = observer(({ organizationId, id, isVisible, hide, mode }: Props) => {
    const { organization, user, viewer } = useStore();
    const wizard = useWizard({ id, mode });

    const currentOrganization = organization.collection.get(organizationId);
    const member = user.collection.get(id ?? '');

    useEffect(() => {
        if (!id) {
            user.fetchListUnassigned.run();
        }
    }, []);

    const isEdit = !!id;
    const isLoading = !user.fetchListUnassigned.isLoaded && user.fetchListUnassigned.isLoading;

    const onFinishCreate = async (values: IMemberForm) => {
        await currentOrganization?.createMember.run(values.id);
        hide();
    };

    const onFinishUpdate = async (values: IMemberForm) => {
        await member?.update.run({
            access: {
                roles: {
                    [ROLES.ORGANIZATION_ADMIN as ROLES]: !!values.ORGANIZATION_ADMIN,
                    [ROLES.AMMO_CONTENT_ADMIN as ROLES]: !!values.AMMO_CONTENT_ADMIN,
                    [ROLES.DEMINING_VIEWER as ROLES]: !!values.DEMINING_VIEWER,
                },
            },
        });
        hide();
    };

    const onRemove = async () => {
        hide();
        !!id && (await currentOrganization?.removeMember.run(id));
    };

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} учасника`}
            placement="right"
            width={500}
            onClose={hide}
            extra={<WizardButtons {...wizard} />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="member-form"
                    onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    disabled={wizard.isView}
                    initialValues={{
                        id,
                        ORGANIZATION_ADMIN: !!member?.hasRole(ROLES.ORGANIZATION_ADMIN),
                        AMMO_CONTENT_ADMIN: !!member?.hasRole(ROLES.AMMO_CONTENT_ADMIN),
                        DEMINING_VIEWER: !!member?.hasRole(ROLES.DEMINING_VIEWER),
                    }}>
                    <Form.Item label="Email" name="id" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select
                            disabled={!wizard.isCreate}
                            options={
                                wizard.isCreate
                                    ? user.listUnassigned.asArray.map(el => ({
                                          label: el.data.info.email,
                                          value: el.id,
                                      }))
                                    : [{ label: member?.data.info.email, value: member?.id }]
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Перегляд demining"
                        name="DEMINING_VIEWER"
                        valuePropName="checked"
                        rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Switch disabled={!viewer?.hasRole(ROLES.DEMINING_VIEWER)} />
                    </Form.Item>
                    <Form.Item
                        label="Адмін організації"
                        name="ORGANIZATION_ADMIN"
                        valuePropName="checked"
                        rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Switch disabled={!viewer?.hasRole(ROLES.ORGANIZATION_ADMIN)} />
                    </Form.Item>
                    <Form.Item
                        label="Автор контенту"
                        name="AMMO_CONTENT_ADMIN"
                        valuePropName="checked"
                        rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Switch disabled={!viewer?.hasRole(ROLES.AMMO_CONTENT_ADMIN)} />
                    </Form.Item>
                    <WizardFooter
                        {...wizard}
                        onCancel={hide}
                        onRemove={onRemove}
                        isRemove={wizard.isRemove && viewer?.permissions?.managment.remove()}
                        loading={currentOrganization?.createMember.isLoading}
                    />
                </Form>
            )}
        </Drawer>
    );
});
