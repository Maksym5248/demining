import { Form, Drawer, Input, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { type EXPLOSIVE_OBJECT_COMPONENT, explosiveObjectComponentData } from 'shared-my';
import { useItemStore } from 'shared-my-client';

import { WizardButtons, WizardFooter, Select } from '~/components';
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
                description: values.description || '',
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
            !!id && store.explosiveObject.classItem.remove.run(id);
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
                extra={<WizardButtons {...wizard} isEditable={item?.isEditable} />}>
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
                            <Select
                                placeholder="Вибрати"
                                options={explosiveObjectComponentData.map(el => ({
                                    label: el.name,
                                    value: el.id,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item label="Класифікація" name="classId" rules={[{ required: true, message: "Є обов'язковим полем" }]}>
                            <Select
                                allowClear
                                showSearch
                                placeholder="Вибрати"
                                options={store.explosiveObject.class.list.asArray.map(el => ({
                                    label: el.displayName,
                                    value: el.id,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item label="Підпорядкований" name="parentId">
                            <Select
                                placeholder="Вибрати"
                                allowClear
                                showSearch
                                options={store.explosiveObject.classItem.list.asArray
                                    .filter(el => el.data.typeId === typeId)
                                    .filter(el => el.data.id !== id)
                                    .map(el => ({
                                        label: el.displayName,
                                        value: el.id,
                                    }))}
                            />
                        </Form.Item>
                        <Form.Item label="Назва" name="name" rules={[{ required: true, message: "Є обов'язковим полем" }]}>
                            <Input placeholder="Введіть дані" />
                        </Form.Item>
                        <Form.Item label="Скорочена назва" name="shortName">
                            <Input placeholder="Введіть дані" />
                        </Form.Item>
                        <Form.Item label="Опис" name="description">
                            <Input.TextArea placeholder="Введіть дані" maxLength={300} />
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
