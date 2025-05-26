import { Button, Form, Space, Drawer, Input, InputNumber } from 'antd';
import { observer } from 'mobx-react-lite';
import { removeFields } from 'shared-my';
import { useSelectStore } from 'shared-my-client';

import { useStore } from '~/hooks';

import { type IExplosiveObjectFillerForm } from './size-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    hide: () => void;
    initialValue: IExplosiveObjectFillerForm;
    onSubmit: (value: IExplosiveObjectFillerForm) => void;
    max: number;
}

export const SizeWizardModal = observer(({ isVisible, hide, onSubmit, initialValue }: Props) => {
    const { explosive } = useStore();
    const explosiveProps = useSelectStore(explosive);

    removeFields(explosiveProps, 'initialItem');

    const onFinish = async (values: IExplosiveObjectFillerForm) => {
        onSubmit?.({
            name: values.name,
            length: values.length,
            width: values.width,
            height: values.height,
            variant: values.variant,
        });
        hide();
    };

    return (
        <Drawer open={isVisible} destroyOnClose title="Додати до розмір" placement="right" width={500} onClose={hide}>
            <Form
                name="explosive-size-form"
                onFinish={onFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{
                    ...(initialValue || {}),
                }}>
                <Form.Item label="Деталі" name="name">
                    <Input placeholder="Деталі" />
                </Form.Item>
                <Form.Item label="Довжина/діаметр, мм" name="length">
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="Ширина, мм" name="width">
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="Висота, мм" name="height">
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="Варіант" name="variant">
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
