import { Form, Drawer, Input, Spin, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import { explosiveObjectClassData, explosiveObjectComponentData } from 'shared-my';
import { useItemStore } from 'shared-my-client';

import { WizardButtons, WizardFooter } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';

import { s } from './explosive-object-classification-wizard.style';
import { type IExplosiveObjectClassForm } from './explosive-object-classification-wizard.types';

interface Props {
    id?: string;
    typeId: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

const { Option } = Select;

export const ExplosiveObjectClassificationWizardModal = observer(({ id, typeId, isVisible, hide, mode }: Props) => {
    const store = useStore();
    const wizard = useWizard({ id, mode });

    const { isLoading, item } = useItemStore(store.explosiveObject.class, id as string);

    const isEdit = !!id;
    console.log('typeId', typeId);

    const onFinishCreate = async (values: IExplosiveObjectClassForm) => {
        await store.explosiveObject.class.create.run({
            ...values,
            parentId: values.parentId || null,
            typeId,
        });
        hide();
    };

    const onFinishUpdate = async (values: IExplosiveObjectClassForm) => {
        await item?.update.run(values);
        hide();
    };

    const onRemove = async () => {
        !!id && store.explosiveObject.class.remove.run(id);
        hide();
    };

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} тип`}
            placement="right"
            width={500}
            onClose={hide}
            extra={<WizardButtons {...wizard} />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="explosive-object-class"
                    onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    disabled={wizard.isView}
                    initialValues={item ? { ...item.data } : {}}>
                    <Form.Item label="Частина" name="component" rules={[{ required: true, message: "Є обов'язковим полем" }]}>
                        <Select placeholder="Вибрати">
                            {explosiveObjectComponentData.map((el) => (
                                <Option value={el.id} key={el.id}>
                                    {el.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Класифікація" name="class" rules={[{ required: true, message: "Є обов'язковим полем" }]}>
                        <Select placeholder="Вибрати">
                            {explosiveObjectClassData.map((el) => (
                                <Option value={el.class} key={el.class}>
                                    {el.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Назва" name="name" rules={[{ required: true, message: "Є обов'язковим полем" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <WizardFooter
                        {...wizard}
                        onCancel={hide}
                        onRemove={onRemove}
                        isLoading={item?.update.isLoading || store.explosiveObject.class.create.isLoading}
                    />
                </Form>
            )}
        </Drawer>
    );
});
