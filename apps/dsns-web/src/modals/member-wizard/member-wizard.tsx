import { useEffect } from 'react';

import { Form, Drawer, Spin, Switch } from 'antd';
import { observer } from 'mobx-react-lite';

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
    const isLoading =
        (!user.fetchListUnassigned.isLoaded && user.fetchListUnassigned.isLoading) ||
        currentOrganization?.createMember.isLoading ||
        currentOrganization?.updateMember.isLoading;

    const onFinishCreate = async (values: IMemberForm) => {
        await currentOrganization?.createMember.run(values.id, values.isAdmin);
        hide();
    };

    const onFinishUpdate = async (values: IMemberForm) => {
        await currentOrganization?.updateMember.run(values.id, values.isAdmin);
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
                        isAdmin: !!member?.isOrganizationAdmin,
                    }}>
                    <Form.Item label="Email" name="id" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select
                            disabled={!wizard.isCreate}
                            options={
                                wizard.isCreate
                                    ? user.listUnassigned.asArray.map((el) => ({
                                          label: el.data.email,
                                          value: el.id,
                                      }))
                                    : [{ label: member?.data.email, value: member?.id }]
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Адмін організації"
                        name="isAdmin"
                        valuePropName="checked"
                        rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Switch disabled={!viewer.user?.isRootAdmin} />
                    </Form.Item>
                    <WizardFooter
                        {...wizard}
                        onCancel={hide}
                        onRemove={onRemove}
                        isRemove={
                            wizard.isRemove &&
                            (viewer.user?.isRootAdmin || (viewer.user?.isOrganizationAdmin && !member?.isOrganizationAdmin))
                        }
                    />
                </Form>
            )}
        </Drawer>
    );
});
