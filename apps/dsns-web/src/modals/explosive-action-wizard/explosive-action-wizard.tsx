import { Button, Form, Space, InputNumber, Drawer } from 'antd';
import { observer } from 'mobx-react-lite';

import { SelectAsync } from '~/components';
import { EXPLOSIVE_TYPE, MODALS, WIZARD_MODE } from '~/constants';
import { useSelectStore, useStore } from '~/hooks';
import { Modal } from '~/services';
import { IExplosiveActionValue } from '~/stores';
import { removeFields } from '~/utils';

import { IExplosiveActionForm } from './explosive-action-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    hide: () => void;
    initialValue: IExplosiveActionValue;
    onSubmit: (value: IExplosiveActionForm) => void;
}

export const ExplosiveActionWizardModal = observer(({ isVisible, hide, onSubmit, initialValue }: Props) => {
    const { explosive } = useStore();
    const explosiveProps = useSelectStore(explosive);

    removeFields(explosiveProps, 'initialItem');

    const onFinish = async (values: IExplosiveActionForm) => {
        onSubmit?.(values);
        hide();
    };

    const onCreateExplosive = () => {
        Modal.show(MODALS.EXPLOSIVE_WIZARD, { mode: WIZARD_MODE.CREATE });
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
                        options={explosiveProps.list.map((el) => ({
                            label: el?.name,
                            value: el.id,
                        }))}
                    />
                </Form.Item>
                <Form.Item noStyle shouldUpdate={() => true}>
                    {({ getFieldValue }) => {
                        const explosiveId = getFieldValue('explosiveId');
                        const currentExplosive = explosive.collection.get(explosiveId);

                        return currentExplosive?.type === EXPLOSIVE_TYPE.EXPLOSIVE ? (
                            <Form.Item label="Вага, кг" name="weight" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                                <InputNumber size="middle" min={0.001} max={100000} />
                            </Form.Item>
                        ) : undefined;
                    }}
                </Form.Item>

                <Form.Item noStyle shouldUpdate={() => true}>
                    {({ getFieldValue }) => {
                        const explosiveId = getFieldValue('explosiveId');
                        const currentExplosive = explosive.collection.get(explosiveId);

                        return currentExplosive?.type === EXPLOSIVE_TYPE.DETONATOR ? (
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
