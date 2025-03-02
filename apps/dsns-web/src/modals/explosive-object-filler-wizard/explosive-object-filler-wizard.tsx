import { Button, Form, Space, Drawer, Input, InputNumber } from 'antd';
import { observer } from 'mobx-react-lite';
import { removeFields } from 'shared-my';
import { useSelectStore } from 'shared-my-client';

import { SelectAsync, Select } from '~/components';
import { useStore } from '~/hooks';

import { type IExplosiveObjectFillerForm } from './explosive-object-filler-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    hide: () => void;
    initialValue: IExplosiveObjectFillerForm;
    onSubmit: (value: IExplosiveObjectFillerForm) => void;
    max: number;
}

enum Type {
    Explosive = 'explosive',
    Other = 'other',
}

const types = [
    {
        value: Type.Explosive,
        label: 'Вибухова речовина',
    },
    {
        value: Type.Other,
        label: 'інші',
    },
];

export const ExplosiveObjectFillerWizardModal = observer(({ isVisible, hide, onSubmit, initialValue }: Props) => {
    const { explosive } = useStore();
    const explosiveProps = useSelectStore(explosive);

    removeFields(explosiveProps, 'initialItem');

    const onFinish = async (values: IExplosiveObjectFillerForm) => {
        onSubmit?.({
            explosiveId: values.explosiveId,
            name: values.name,
            weight: values.weight,
            variant: values.variant,
        });
        hide();
    };

    return (
        <Drawer open={isVisible} destroyOnClose title="Додати до складу" placement="right" width={500} onClose={hide}>
            <Form
                name="explosive-filler-form"
                onFinish={onFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{
                    type: Type.Explosive,
                    ...(initialValue || {}),
                }}>
                <Form.Item label="Тип" name="type" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                    <Select options={types} />
                </Form.Item>
                <Form.Item noStyle shouldUpdate={() => true}>
                    {({ getFieldValue }) => {
                        const value = getFieldValue('type');

                        return (
                            value === Type.Explosive && (
                                <Form.Item
                                    label="Вибухова речовина"
                                    name="explosiveId"
                                    rules={[{ required: true, message: "Обов'язкове поле" }]}>
                                    <SelectAsync
                                        {...explosiveProps}
                                        options={explosiveProps.list.map(el => ({
                                            label: el?.displayName,
                                            value: el.data.id,
                                        }))}
                                    />
                                </Form.Item>
                            )
                        );
                    }}
                </Form.Item>
                <Form.Item noStyle shouldUpdate={() => true}>
                    {({ getFieldValue }) => {
                        const value = getFieldValue('type');

                        return (
                            value === Type.Other && (
                                <Form.Item label="Назва" name="name">
                                    <Input />
                                </Form.Item>
                            )
                        );
                    }}
                </Form.Item>
                <Form.Item label="Варіант" name="variant" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="Вага, кг" name="weight" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                    <InputNumber min={0} />
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
