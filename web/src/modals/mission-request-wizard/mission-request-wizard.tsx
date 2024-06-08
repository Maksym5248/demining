import { useEffect } from 'react';

import { Form, DatePicker, Drawer, Spin, Input } from 'antd';
import { observer } from 'mobx-react-lite';

import { Select, WizardButtons, WizardFooter } from '~/components';
import { MISSION_REQUEST_TYPE, WIZARD_MODE } from '~/constants';
import { missionRequestType } from '~/data';
import { useStore, useWizard } from '~/hooks';
import { dates } from '~/utils';

import { s } from './mission-request-wizard.style';
import { IMissionRequestForm } from './mission-request-wizard.types';

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
    const isLoading =
        store.missionRequest.fetchList.inProgress ||
        store.missionRequest.remove.inProgress ||
        store.missionRequest.create.inProgress ||
        missionRequest?.update.inProgress;

    const onFinishCreate = async (values: IMissionRequestForm) => {
        await store.missionRequest.create.run(values);
        hide();
    };

    const onFinishUpdate = async (values: IMissionRequestForm) => {
        await missionRequest.update.run(values);
        hide();
    };

    const onRemove = async () => {
        await store.missionRequest.remove.run(id);
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
                            ? { ...missionRequest }
                            : {
                                  type: MISSION_REQUEST_TYPE.APPLICATION,
                                  number: (store.missionRequest.list.first?.number ?? 0) + 1,
                                  signedAt: dates.today(),
                              }
                    }>
                    <Form.Item
                        label="Тип"
                        name="type"
                        rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select
                            options={missionRequestType.map(({ name, value }) => ({
                                label: name,
                                value,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item label="Номер" name="number" rules={[{ required: true }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item
                        label="Дата підписання"
                        name="signedAt"
                        rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <DatePicker />
                    </Form.Item>
                    <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} />
                </Form>
            )}
        </Drawer>
    );
});
