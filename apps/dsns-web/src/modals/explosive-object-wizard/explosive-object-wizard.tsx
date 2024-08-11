import { useEffect } from 'react';

import { Form, Input, Drawer, InputNumber, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { explosiveObjectComponentData } from 'shared-my/db';
import { TREE_ROOT_ID } from 'shared-my-client/models';
import { type IExplosiveObjectClassItem } from 'shared-my-client/stores';

import { Select, TreeSelect, WizardButtons, WizardFooter } from '~/components';
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
                    <Form.Item label="Класифікація" name="classIds" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Form.Item noStyle shouldUpdate={() => true}>
                            {({ getFieldValue, setFieldValue }) => {
                                const classIds = getFieldValue('classIds');
                                const groupId = getFieldValue('groupId');
                                const component = getFieldValue('component');

                                const classsifications = explosiveObject.getClassesByGroupId(groupId, component);

                                return classsifications.map((classification) => {
                                    const children =
                                        classification.itemsTree.tree?.children.filter(
                                            (item) => !item?.item?.data.parentId || !!classIds.includes(item?.item.data.parentId),
                                        ) ?? [];

                                    const onChange = (newValue: string) => {
                                        const classItemsIds = classification.items.map((item) => item.data.id);

                                        const prevValue = classIds.filter((id: string) => classItemsIds.includes(id));
                                        const prevValueChilds = prevValue
                                            .map((id: string) => explosiveObject.treeClassesItems.getAllChildsIds(id))
                                            .reduce((acc: string[], val: string[]) => [...acc, ...val], []);

                                        let value = classIds.filter((id: string) => ![...prevValue, ...prevValueChilds].includes(id));

                                        if (newValue) {
                                            const newValueParents = explosiveObject.treeClassesItems
                                                .getAllParentsIds(newValue)
                                                .filter((id: string) => id !== TREE_ROOT_ID)
                                                .filter((id) => !value.includes(id));
                                            value = [...value, newValue, ...newValueParents];
                                        }

                                        setFieldValue('classIds', value);
                                    };

                                    return (
                                        !!children.length && (
                                            <Form.Item key={classification.data.id}>
                                                <TreeSelect
                                                    treeData={transformTreeNodesToTreeData<IExplosiveObjectClassItem>(
                                                        classification.itemsTree?.tree?.children ?? [],
                                                        (item) => item?.data?.name ?? '',
                                                    )}
                                                    placeholder={classification.displayName}
                                                    onChange={onChange}
                                                />
                                            </Form.Item>
                                        )
                                    );
                                });
                            }}
                        </Form.Item>
                    </Form.Item>

                    <Form.Item noStyle shouldUpdate={() => true}>
                        {({ getFieldValue }) => {
                            const groupId = getFieldValue('groupId');
                            const group = explosiveObject.collectionGroups.get(groupId);

                            return (
                                !!group?.data.hasCaliber && (
                                    <Form.Item label="Калібр" name="caliber">
                                        <InputNumber size="middle" min={1} max={100000} />
                                    </Form.Item>
                                )
                            );
                        }}
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
