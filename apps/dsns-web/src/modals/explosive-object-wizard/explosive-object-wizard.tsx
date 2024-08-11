import { useEffect } from 'react';

import { Form, Input, Drawer, InputNumber, Spin, TreeSelect } from 'antd';
import { observer } from 'mobx-react-lite';
import { explosiveObjectComponentData } from 'shared-my/db';
import { type IExplosiveObjectClassItem } from 'shared-my-client/stores';

import { Select, WizardButtons, WizardFooter } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';
import { select, transformTreeNodesToTreeData } from '~/utils';

import { s } from './explosive-object-wizard.style';
import { type IExplosiveObjectForm } from './explosive-object-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

export const ExplosiveObjectWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const { explosiveObject } = useStore();
    const wizard = useWizard({ id, mode });

    const currentExplosiveObject = explosiveObject.collection.get(id as string);

    const isEdit = !!id;
    const isLoading = explosiveObject.fetchItem.isLoading;
    const firstType = explosiveObject.listTypes.first;

    const onFinishCreate = async (values: IExplosiveObjectForm) => {
        await explosiveObject.create.run(values);
        hide();
    };

    const onFinishUpdate = async (values: IExplosiveObjectForm) => {
        await currentExplosiveObject?.update.run(values);
        hide();
    };

    const onRemove = () => {
        !!id && explosiveObject.remove.run(id);
        hide();
    };

    useEffect(() => {
        !!id && explosiveObject.fetchItem.run(id);
    }, [id]);

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} ВНП`}
            placement="right"
            width={500}
            onClose={hide}
            extra={<WizardButtons {...wizard} />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="explosive-object-form"
                    onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    disabled={wizard.isView}
                    initialValues={
                        currentExplosiveObject
                            ? { ...currentExplosiveObject.data, caliber: currentExplosiveObject.details?.data.caliber }
                            : {
                                  typeId: firstType?.data.id,
                              }
                    }>
                    <Form.Item label="Тип" name="typeId" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select
                            options={select.append(
                                explosiveObject.sortedListTypes.map((el) => ({
                                    label: el.displayName,
                                    value: el.data.id,
                                })),
                                {
                                    label: currentExplosiveObject?.type?.displayName,
                                    value: currentExplosiveObject?.type?.data.id,
                                },
                            )}
                        />
                    </Form.Item>
                    <Form.Item label="Група" name="groupId" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select
                            options={select.append(
                                explosiveObject.listGroups.asArray.map((el) => ({
                                    label: el.displayName,
                                    value: el.data.id,
                                })),
                                {
                                    label: currentExplosiveObject?.group?.displayName,
                                    value: currentExplosiveObject?.group?.data.id,
                                },
                            )}
                        />
                    </Form.Item>
                    <Form.Item label="Частина" name="component" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select
                            options={explosiveObjectComponentData.map((el) => ({
                                label: el.name,
                                value: el.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item label="Класифікація" name="classIds">
                        <Form.Item noStyle shouldUpdate={() => true}>
                            {({ getFieldValue }) => {
                                const groupId = getFieldValue('groupId');
                                const component = getFieldValue('component');

                                const classsification = explosiveObject.getClassesByGroupId(groupId, component);
                                console.log('classsification', classsification);
                                return (
                                    <TreeSelect
                                        showSearch
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        placeholder="Please select"
                                        allowClear
                                        multiple
                                        treeDefaultExpandAll
                                        treeData={classsification.map((el) => ({
                                            id: el.data.id,
                                            label: el.data.name,
                                            children: transformTreeNodesToTreeData<IExplosiveObjectClassItem>(
                                                el.childrenTree,
                                                (item) => item.data.name,
                                            ),
                                        }))}
                                    />
                                );
                            }}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Калібр" name="caliber">
                        <InputNumber size="middle" min={1} max={100000} />
                    </Form.Item>
                    <Form.Item label="Назва" name="name" rules={[{ message: "Прізвище є обов'язковим полем" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} />
                </Form>
            )}
        </Drawer>
    );
});
