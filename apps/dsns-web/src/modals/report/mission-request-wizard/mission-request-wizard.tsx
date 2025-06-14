import { useEffect } from 'react';

import { Form, DatePicker, Drawer, Spin, Input } from 'antd';
import { observer } from 'mobx-react-lite';
import { MISSION_REQUEST_TYPE } from 'shared-my';
import { dates } from 'shared-my-client';

import { Select, WizardButtons, WizardFooter } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';

import { s } from './mission-request-wizard.style';
import { type IMissionRequestForm } from './mission-request-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

export const MissionRequestWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const store = useStore();
    const wizard = useWizard({ id, mode });

    const missionRequest = store.missionRequest.collection.get(id as string);

    useEffect(() => {
        store.missionRequest.fetchList.run();
    }, []);

    const isEdit = !!id;
    const isLoading = store.missionRequest.fetchList.isLoading || store.missionRequest.remove.isLoading;

    const onFinishCreate = async (values: IMissionRequestForm) => {
        await store.missionRequest.create.run(values);
        hide();
    };

    const onFinishUpdate = async (values: IMissionRequestForm) => {
        await missionRequest?.update.run(values);
        hide();
    };

    const onRemove = async () => {
        !!id && (await store.missionRequest.remove.run(id));
        hide();
    };

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} заявку`}
            placement="right"
            width={500}
            onClose={hide}
            extra={<WizardButtons {...wizard} />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="mission-request-form"
                    onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    disabled={wizard.isView}
                    initialValues={
                        missionRequest
                            ? { ...missionRequest.data }
                            : {
                                  type: MISSION_REQUEST_TYPE.APPLICATION,
                                  number: (store.missionRequest.list.first?.data.number ?? 0) + 1,
                                  signedAt: dates.today(),
                              }
                    }>
                    <Form.Item label="Тип" name="type" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select
                            options={store.missionRequest.collectionType.asArray.map(item => ({
                                label: item.displayName,
                                value: item.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item label="Номер" name="number" rules={[{ required: true }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item label="Дата підписання" name="signedAt" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <DatePicker />
                    </Form.Item>
                    <WizardFooter
                        {...wizard}
                        onCancel={hide}
                        onRemove={onRemove}
                        loading={store.missionRequest.create.isLoading || missionRequest?.update.isLoading}
                    />
                </Form>
            )}
        </Drawer>
    );
});
