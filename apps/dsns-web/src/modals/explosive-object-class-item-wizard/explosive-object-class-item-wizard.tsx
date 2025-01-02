import { Form, Drawer, Input, Spin, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import { type EXPLOSIVE_OBJECT_COMPONENT, explosiveObjectComponentData } from 'shared-my';
import { useItemStore } from 'shared-my-client';

import { WizardButtons, WizardFooter } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';

import { s } from './explosive-object-class-item-wizard.style';
import { type IExplosiveObjectClassItemForm } from './explosive-object-class-item-wizard.types';

interface Props {
    id?: string;
    typeId: string;
    parentId?: string;
    classId?: string;
    component?: EXPLOSIVE_OBJECT_COMPONENT;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

const { Option } = Select;

export const ExplosiveObjectClassItemWizardModal = observer(
    ({ id, typeId, classId, component, parentId, isVisible, hide, mode }: Props) => {
        const store = useStore();
        const wizard = useWizard({ id, mode });

        const { isLoading, item } = useItemStore(store.explosiveObject.classItem, id as string);

        const isEdit = !!id;

        const onFinishCreate = async (values: IExplosiveObjectClassItemForm) => {
            await store.explosiveObject.classItem.create.run({
                ...values,
                typeId,
                parentId: values.parentId || null,
            });
            hide();
        };

        const onFinishUpdate = async (values: IExplosiveObjectClassItemForm) => {
            await item?.update.run({
                ...values,
                typeId,
            });
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
                title={`${isEdit ? 'Редагувати' : 'Створити'} елемент класифікації`}
                placement="right"
                width={500}
                onClose={hide}
                extra={<WizardButtons {...wizard} />}>
                {isLoading ? (
                    <Spin css={s.spin} />
                ) : (
                    <Form
                        name="explosive-object-class-item"
                        onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        disabled={wizard.isView}
                        initialValues={item ? { ...item.data } : { typeId, parentId, classId, component }}>
                        <Form.Item label="Частина" name="component" rules={[{ required: true, message: "Є обов'язковим полем" }]}>
                            <Select placeholder="Вибрати">
                                {explosiveObjectComponentData.map((el) => (
                                    <Option value={el.id} key={el.id}>
                                        {el.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Класифікація" name="classId" rules={[{ required: true, message: "Є обов'язковим полем" }]}>
                            <Select placeholder="Вибрати">
                                {store.explosiveObject.class.list.asArray.map((el) => (
                                    <Option value={el.id} key={el.id}>
                                        {el.displayName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Підпорядкований" name="parentId">
                            <Select placeholder="Вибрати">
                                {store.explosiveObject.classItem.list.asArray
                                    .filter((el) => el.data.typeId === typeId)
                                    .map((el) => (
                                        <Option value={el.id} key={el.id}>
                                            {el.displayName}
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
    },
);
