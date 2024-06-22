import { Button, Form, Space, InputNumber, Drawer, Switch } from 'antd';
import { observer } from 'mobx-react-lite';
import { removeFields } from 'shared-my/common';
import { EXPLOSIVE_OBJECT_CATEGORY } from 'shared-my/db';
import { useSelectStore } from 'shared-my-client/common';
import { type IExplosiveObjectTypeData } from 'shared-my-client/stores';

import { Select, SelectAsync } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore } from '~/hooks';
import { Modal } from '~/services';

import { type IExplosiveObjectActionForm } from './explosive-object-action-wizard.types';

const optionsExplosiveObjectCategory = [
    {
        value: EXPLOSIVE_OBJECT_CATEGORY.I,
        label: `${EXPLOSIVE_OBJECT_CATEGORY.I} дозволено транспортувати`,
    },
    {
        value: EXPLOSIVE_OBJECT_CATEGORY.II,
        label: `${EXPLOSIVE_OBJECT_CATEGORY.II} не дозволено транспортувати`,
    },
];

interface Props {
    id?: string;
    isVisible: boolean;
    hide: () => void;
    initialValue: IExplosiveObjectTypeData;
    onSubmit: (value: IExplosiveObjectActionForm) => void;
}

export const ExplosiveObjectActionWizardModal = observer(({ isVisible, hide, onSubmit, initialValue }: Props) => {
    const { explosiveObject } = useStore();
    const explosiveObjectProps = useSelectStore(explosiveObject);

    removeFields(explosiveObjectProps, 'initialItem');

    const onFinish = async (values: IExplosiveObjectActionForm) => {
        onSubmit?.(values);
        hide();
    };

    const onAddExplosiveObject = () => {
        Modal.show(MODALS.EXPLOSIVE_OBJECT_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    return (
        <Drawer open={isVisible} destroyOnClose title="Створити виявлений ВНП" placement="right" width={500} onClose={hide}>
            <Form
                name="explosive-object-actions--form"
                onFinish={onFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={
                    initialValue ?? {
                        explosiveObjectId: undefined,
                        quantity: 1,
                        category: EXPLOSIVE_OBJECT_CATEGORY.I,
                        isDiscovered: true,
                        isTransported: true,
                        isDestroyed: true,
                    }
                }>
                <Form.Item label="ВНП" name="explosiveObjectId" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                    <SelectAsync
                        {...explosiveObjectProps}
                        onAdd={onAddExplosiveObject}
                        options={explosiveObjectProps.list.map((el) => ({
                            label: el?.fullDisplayName,
                            value: el.data.id,
                        }))}
                    />
                </Form.Item>
                <Form.Item label="Категорія" name="category" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                    <Select options={optionsExplosiveObjectCategory} placeholder="Вибрати" />
                </Form.Item>
                <Form.Item label="Кількість" name="quantity" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                    <InputNumber size="middle" min={1} max={100000} />
                </Form.Item>
                <Form.Item label="Виявлено: " name="isDiscovered" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item label="Транспортовано: " name="isTransported" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item label="Знищено: " name="isDestroyed" valuePropName="checked">
                    <Switch />
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
