import { useEffect } from 'react';

import { Form, Input, Drawer, InputNumber, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import {
    EXPLOSIVE_OBJECT_STATUS,
    explosiveObjectComponentData,
    explosiveObjectStatuses,
    materialsData,
    measurement,
    MIME_TYPE,
} from 'shared-my';
import { type ITempartureData, type ISizeData } from 'shared-my-client';

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

const getParams = ({
    caliber,
    material,
    size,
    weight,
    temperature,
    filler,
    fuseIds,
    purpose,
    structure,
    action,
    ...values
}: IExplosiveObjectForm) => ({
    ...values,
    details: {
        caliber,
        material,
        size: {
            length: size?.length ? measurement.mmToM(size?.length) : null,
            width: size?.width ? measurement.mmToM(size?.width) : null,
            height: size?.height ? measurement.mmToM(size?.height) : null,
        },
        weight,
        temperature,
        filler,
        fuseIds,
        purpose,
        structure,
        action,
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
            width={600}
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
                            ? {
                                  ...currentExplosiveObject.data,
                                  ...currentExplosiveObject.details?.data,
                                  size: {
                                      length: currentExplosiveObject.details?.data.size?.length
                                          ? measurement.mToMm(currentExplosiveObject.details?.data.size?.length)
                                          : null,
                                      width: currentExplosiveObject.details?.data.size?.width
                                          ? measurement.mToMm(currentExplosiveObject.details?.data.size?.width)
                                          : null,
                                      height: currentExplosiveObject.details?.data.size?.height
                                          ? measurement.mToMm(currentExplosiveObject.details?.data.size?.height)
                                          : null,
                                  },
                              }
                            : {
                                  typeId: firstType?.data.id,
                                  status: EXPLOSIVE_OBJECT_STATUS.PENDING,
                                  classItemIds: [],
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
                    {viewer.user?.isAuthor && (
                        <Form.Item label="Статус" name="status">
                            <Select options={explosiveObjectStatuses} />
                        </Form.Item>
                    )}
                    <Form.Item label="Маркування" name="name" rules={[{ required: true, message: "Прізвище є обов'язковим полем" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item label="Тип" name="typeId" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select
                            options={select.append(
                                explosiveObject.type.sortedListTypes.map(el => ({
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
                            options={explosiveObjectComponentData.map(el => ({
                                label: el.name,
                                value: el.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item label="Країна" name="countryId" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select
                            options={explosiveObject.listCountries.asArray.map(el => ({
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
                    <Form.Item label="Корпус" name="material">
                        <Select
                            options={materialsData.map(el => ({
                                label: el.name,
                                value: el.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={() => true}>
                        {({ getFieldValue, setFieldValue }) => {
                            const size = (getFieldValue('size') as ISizeData) ?? {};
                            return (
                                <Form.Item label="Розмір, мм" name="size">
                                    <InputNumber
                                        placeholder="Довжина/радіус"
                                        onChange={length => setFieldValue('size', { ...size, length })}
                                        value={size?.length}
                                        min={0}
                                    />
                                    <InputNumber
                                        placeholder="Ширина"
                                        css={s.size}
                                        onChange={width => setFieldValue('size', { ...size, width })}
                                        value={size?.width}
                                        min={0}
                                    />
                                    <InputNumber
                                        placeholder="Висота"
                                        onChange={height => setFieldValue('size', { ...size, height })}
                                        value={size?.height}
                                        min={0}
                                    />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                    <Form.Item label="Вага, кг" name="weight">
                        <InputNumber placeholder="Ввести" />
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={() => true}>
                        {({ getFieldValue, setFieldValue }) => {
                            const value = (getFieldValue('temperature') as ITempartureData) ?? {};

                            return (
                                <Form.Item label="Температура, °C" name="temperature">
                                    <InputNumber
                                        placeholder="Макс"
                                        onChange={max => setFieldValue('temperature', { ...value, max })}
                                        value={value?.max}
                                    />
                                    <InputNumber
                                        placeholder="Мін"
                                        onChange={min => setFieldValue('temperature', { ...value, min })}
                                        value={value?.min}
                                        css={s.size}
                                    />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                    <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} />
                </Form>
            )}
        </Drawer>
    );
});
