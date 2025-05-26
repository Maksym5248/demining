import { Button, Form, Space, InputNumber, Drawer, Input } from 'antd';
import { observer } from 'mobx-react-lite';
import { removeFields } from 'shared-my';
import { useSelectStore } from 'shared-my-client';
import { type IExplosiveObjectTypeData } from 'shared-my-client';

import { Select, SelectAsync } from '~/components';
import { useStore } from '~/hooks';

import { type IExplosiveCompositionForm } from './explosive-composition-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    hide: () => void;
    initialValue: IExplosiveObjectTypeData;
    onSubmit: (value: IExplosiveCompositionForm) => void;
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

export const ExplosiveCompositionWizardModal = observer(({ isVisible, hide, onSubmit, initialValue, max }: Props) => {
    const { explosive } = useStore();
    const explosiveProps = useSelectStore(explosive);

    removeFields(explosiveProps, 'initialItem');

    const onFinish = async (values: IExplosiveCompositionForm) => {
        onSubmit?.(values);
        hide();
    };

    return (
        <Drawer open={isVisible} destroyOnClose title="Додати до складу" placement="right" width={500} onClose={hide}>
            <Form
                name="explosive-composition--form"
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
                <Form.Item label="Опис" name="description">
                    <Input.TextArea maxLength={300} />
                </Form.Item>
                <Form.Item label="Кількість, %" name="percent" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                    <InputNumber max={max} min={0} />
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
