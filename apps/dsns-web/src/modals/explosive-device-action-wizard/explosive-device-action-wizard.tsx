import { Button, Form, Space, InputNumber, Drawer } from 'antd';
import { observer } from 'mobx-react-lite';
import { removeFields, EXPLOSIVE_DEVICE_TYPE } from 'shared-my';
import { useSelectStore } from 'shared-my-client';
import { type IExplosiveDeviceActionData } from 'shared-my-client';

import { SelectAsync } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore } from '~/hooks';
import { Modal } from '~/services';

import { type IExplosiveActionForm } from './explosive-device-action-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    hide: () => void;
    initialValue: IExplosiveDeviceActionData;
    onSubmit: (value: IExplosiveActionForm) => void;
}

export const ExplosiveDeviceActionWizardModal = observer(({ isVisible, hide, onSubmit, initialValue }: Props) => {
    const { explosiveDevice } = useStore();
    const explosiveProps = useSelectStore(explosiveDevice);

    removeFields(explosiveProps, 'initialItem');

    const onFinish = async (values: IExplosiveActionForm) => {
        onSubmit?.(values);
        hide();
    };

    const onCreateExplosive = () => {
        Modal.show(MODALS.EXPLOSIVE_DEVICE_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    return (
        <Drawer open={isVisible} destroyOnClose title="Використано ВР та ЗП" placement="right" width={500} onClose={hide}>
            <Form
                name="explosive-actions--form"
                onFinish={onFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={
                    initialValue ?? {
                        explosiveId: undefined,
                        quantity: 0,
                        weight: 0,
                    }
                }>
                <Form.Item label="ВНП" name="explosiveId" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                    <SelectAsync
                        {...explosiveProps}
                        onAdd={onCreateExplosive}
                        options={explosiveProps.list.map(el => ({
                            label: el?.data.name,
                            value: el.data.id,
                        }))}
                    />
                </Form.Item>
                <Form.Item noStyle shouldUpdate={() => true}>
                    {({ getFieldValue }) => {
                        const explosiveId = getFieldValue('explosiveId');
                        const currentExplosive = explosiveDevice.collection.get(explosiveId);

                        return currentExplosive?.data.type === EXPLOSIVE_DEVICE_TYPE.EXPLOSIVE ? (
                            <Form.Item label="Вага, кг" name="weight" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                                <InputNumber size="middle" min={0.001} max={100000} />
                            </Form.Item>
                        ) : undefined;
                    }}
                </Form.Item>

                <Form.Item noStyle shouldUpdate={() => true}>
                    {({ getFieldValue }) => {
                        const explosiveId = getFieldValue('explosiveId');
                        const currentExplosive = explosiveDevice.collection.get(explosiveId);

                        return currentExplosive?.data.type === EXPLOSIVE_DEVICE_TYPE.DETONATOR ? (
                            <Form.Item label="Кількість, од" name="quantity" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                                <InputNumber size="middle" min={1} step={1} max={100000} />
                            </Form.Item>
                        ) : null;
                    }}
                </Form.Item>
                <Form.Item label=" " colon={false}>
                    <Space>
                        <Button onClick={hide}>Скасувати</Button>
                        <Button htmlType="submit" type="primary">
                            Додати
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Drawer>
    );
});
