import { Form, Select, Drawer, Input, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { EQUIPMENT_TYPE } from 'shared-my';
import { useItemStore } from 'shared-my-client';

import { WizardButtons, WizardFooter } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';

import { s } from './equipment-wizard.style';
import { type IEquipmentForm } from './equipment-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

const typeOptions = [
    {
        label: 'Міношукач',
        value: EQUIPMENT_TYPE.MINE_DETECTOR,
    },
];

export const EquipmentWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const store = useStore();
    const wizard = useWizard({ id, mode });

    const { isLoading, item } = useItemStore(store.equipment, id as string);

    const isEdit = !!id;

    const onFinishCreate = async (values: IEquipmentForm) => {
        await store.equipment.create.run(values);
        hide();
    };

    const onFinishUpdate = async (values: IEquipmentForm) => {
        await item?.update.run(values);
        hide();
    };

    const onRemove = () => {
        !!id && store.equipment.remove.run(id);
        hide();
    };

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} обладнання`}
            placement="right"
            width={500}
            onClose={hide}
            extra={<WizardButtons {...wizard} />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="equipment-form"
                    onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    disabled={wizard.isView}
                    initialValues={item ? { ...item.data } : { type: EQUIPMENT_TYPE.MINE_DETECTOR }}>
                    <Form.Item label="Назва" name="name" rules={[{ required: true, message: "Назва є обов'язковим полем" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item label="Тип" name="type" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select options={typeOptions} />
                    </Form.Item>
                    <WizardFooter
                        {...wizard}
                        onCancel={hide}
                        onRemove={onRemove}
                        loading={!!store.equipment.create.isLoading || !!item?.update.isLoading}
                    />
                </Form>
            )}
        </Drawer>
    );
});
