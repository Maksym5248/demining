import { useEffect } from 'react';

import { Form, Drawer, Spin, Input } from 'antd';
import { observer } from 'mobx-react-lite';

import { WizardButtons, WizardFooter } from '~/components';
import { WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';

import { s } from './organization-wizard.style';
import { IOrganizationForm } from './organization-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    hide: () => void;
    mode: WIZARD_MODE;
}

export const OrganizationWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const { organization } = useStore();
    const wizard = useWizard({ id, mode });

    const currentOrganization = organization.collection.get(id as string);

    useEffect(() => {
        organization.fetchList.run();
    }, []);

    const isEdit = !!id;
    const isLoading = !organization.fetchList.isLoaded && organization.fetchList.inProgress;

    const onFinishCreate = async (values: IOrganizationForm) => {
        await organization.create.run(values);
        hide();
    };

    const onFinishUpdate = async (values: IOrganizationForm) => {
        await currentOrganization.update.run(values);
        hide();
    };

    const onRemove = async () => {
        await organization.remove.run(id);
        hide();
    };

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} організацію`}
            placement="right"
            width={500}
            onClose={hide}
            extra={<WizardButtons {...wizard} />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="organization-form"
                    onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    disabled={wizard.isView}
                    initialValues={
                        currentOrganization
                            ? { ...currentOrganization }
                            : {
                                  name: '',
                                  membersIds: [],
                              }
                    }>
                    <Form.Item
                        label="Назва"
                        name="name"
                        rules={[{ required: true, message: "Назва є обов'язковим полем" }]}>
                        <Input placeholder="Назва організації" />
                    </Form.Item>
                    <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} />
                </Form>
            )}
        </Drawer>
    );
});
