import { useEffect } from 'react';

import { Form, Input, Drawer, InputNumber, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { EXPLOSIVE_OBJECT_STATUS, explosiveObjectComponentData, explosiveObjectStatuses, MIME_TYPE } from 'shared-my';

import { Select, UploadFile, WizardButtons, WizardFooter } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';
import { select } from '~/utils';

import { Classification } from './components';
import { s } from './explosive-object-wizard.style';
import { type IExplosiveObjectForm } from './explosive-object-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

const getParams = ({ caliber, ...values }: IExplosiveObjectForm) => ({
    ...values,
    details: {
        caliber,
    },
});

export const ExplosiveObjectWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const { explosiveObject, viewer } = useStore();
    const wizard = useWizard({ id, mode });

    const currentExplosiveObject = explosiveObject.collection.get(id as string);

    const isEdit = !!id;
    const isLoading = explosiveObject.fetchItem.isLoading;
    const firstType = explosiveObject.type.list.first;

    const onFinishCreate = async (values: IExplosiveObjectForm) => {
        await explosiveObject.create.run(getParams(values));
        hide();
    };

    const onFinishUpdate = async (values: IExplosiveObjectForm) => {
        await currentExplosiveObject?.update.run(getParams(values));
        hide();
    };

    const onRemove = () => {
        !!id && explosiveObject.remove.run(id);
        hide();
    };

    useEffect(() => {
        !!id && explosiveObject.fetchItem.run(id);
    }, [id]);

    const isEditable = !!viewer.user?.isAuthor || !!currentExplosiveObject?.isCurrentOrganization;

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} ВНП`}
            placement="right"
            width={500}
            onClose={hide}
            extra={<WizardButtons {...wizard} isEditable={isEditable} />}>
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
                                  status: EXPLOSIVE_OBJECT_STATUS.PENDING,
                                  classIds: [],
                              }
                    }>
                    <Form.Item name="image" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                        <Form.Item noStyle shouldUpdate={() => true}>
                            {({ getFieldValue, setFieldValue }) => {
                                const image = getFieldValue('image');
                                const imageUri = getFieldValue('imageUri');

                                const onChangeFile = ({ file }: { file: File | null }) => setFieldValue('image', file);

                                return (
                                    <UploadFile
                                        onChangeFile={onChangeFile}
                                        file={image}
                                        type="image"
                                        accept={[MIME_TYPE.PNG, MIME_TYPE.JPG]}
                                        uri={imageUri}
                                    />
                                );
                            }}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Маркування" name="name" rules={[{ required: true, message: "Прізвище є обов'язковим полем" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item label="Тип" name="typeId" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select
                            options={select.append(
                                explosiveObject.type.sortedListTypes.map((el) => ({
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
                    <Form.Item label="Частина" name="component" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select
                            options={explosiveObjectComponentData.map((el) => ({
                                label: el.name,
                                value: el.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item label="Країна" name="countryId" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select
                            options={explosiveObject.listCountries.asArray.map((el) => ({
                                label: el.data.name,
                                value: el.data.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={() => true}>
                        {({ getFieldValue, setFieldValue }) => {
                            const typeId = getFieldValue('typeId');
                            const component = getFieldValue('component');

                            return <Classification typeId={typeId} component={component} setFieldValue={setFieldValue} />;
                        }}
                    </Form.Item>
                    {viewer.user?.isAuthor && (
                        <Form.Item label="Статус" name="status">
                            <Select options={explosiveObjectStatuses} />
                        </Form.Item>
                    )}
                    <Form.Item noStyle shouldUpdate={() => true}>
                        {({ getFieldValue }) => {
                            const typeId = getFieldValue('typeId');
                            const type = explosiveObject.type.collection.get(typeId);

                            return (
                                !!type?.data.hasCaliber && (
                                    <Form.Item label="Калібр" name="caliber">
                                        <InputNumber size="middle" min={1} max={100000} />
                                    </Form.Item>
                                )
                            );
                        }}
                    </Form.Item>
                    <WizardFooter
                        {...wizard}
                        onCancel={hide}
                        onRemove={onRemove}
                        loading={explosiveObject.create.isLoading || currentExplosiveObject?.update?.isLoading}
                    />
                </Form>
            )}
        </Drawer>
    );
});
