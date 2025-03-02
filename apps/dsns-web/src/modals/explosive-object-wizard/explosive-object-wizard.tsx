import { useEffect } from 'react';

import { Form, Input, Drawer, InputNumber, Spin, Divider } from 'antd';
import { observer } from 'mobx-react-lite';
import {
    EXPLOSIVE_OBJECT_COMPONENT,
    EXPLOSIVE_OBJECT_STATUS,
    explosiveObjectComponentData,
    explosiveObjectStatuses,
    materialsData,
    measurement,
    MIME_TYPE,
} from 'shared-my';
import { type ISizeData, type ITempartureData } from 'shared-my-client';

import {
    FieldFiller,
    FieldModal,
    FieldMulty,
    FieldSection,
    Select,
    UploadFile,
    UploadImages,
    WizardButtons,
    WizardFooter,
} from '~/components';
import { MODALS, type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';
import { AssetStorage } from '~/services';
import { select } from '~/utils';

import { Classification, Fervor, Fuse } from './components';
import { s } from './explosive-object-wizard.style';
import { type IExplosiveObjectForm } from './explosive-object-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

const getSizeLabel = (item: ISizeData) => {
    if (!item.length && !item.width && !item.height) return 'невідомо';

    return item.width ? `${item.length}x${item.width}x${item.height}` : `${item.length}x${item.height}`;
};

const getParams = ({
    caliber,
    material,
    size,
    weight,
    temperature,
    filler,
    fuseIds,
    fervorIds,
    purposeImageUris,
    purposeDescription,
    structureImageUris,
    structureDescription,
    actionImageUris,
    actionDescription,
    imageUris,
    fullDescription,
    ...values
}: IExplosiveObjectForm) => ({
    ...values,
    details: {
        imageUris,
        caliber,
        material,
        fullDescription,
        size:
            size?.map(
                el =>
                    ({
                        name: el.name ?? null,
                        length: el.length ? measurement.mmToM(el.length) : null,
                        width: el.width ? measurement.mmToM(el.width) : null,
                        height: el.height ? measurement.mmToM(el.height) : null,
                        variant: el.variant,
                    }) as ISizeData,
            ) ?? [],
        weight:
            weight?.map((el, i) => ({
                weight: el ?? null,
                variant: i + 1,
            })) ?? [],
        temperature,
        filler,
        fuseIds: fuseIds?.filter(el => !!el) ?? [],
        fervorIds: fervorIds?.filter(el => !!el) ?? [],
        purpose: {
            imageUris: purposeImageUris,
            description: purposeDescription,
        },
        structure: {
            imageUris: structureImageUris,
            description: structureDescription,
        },
        action: {
            imageUris: actionImageUris,
            description: actionDescription,
        },
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
        console.log('onFinishUpdate', getParams(values));
        await currentExplosiveObject?.update.run(getParams(values));
        hide();
    };

    const onRemove = () => {
        !!id && explosiveObject.remove.run(id);
        hide();
    };

    const customRequest = (file: File) => AssetStorage.image.create(file);

    useEffect(() => {
        !!id && explosiveObject.fetchItem.run(id);
    }, [id]);

    const isSubmitting = explosiveObject.create.isLoading || !!currentExplosiveObject?.update?.isLoading;
    console.log('isSubmitting', currentExplosiveObject?.details?.data?.size);
    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} ВНП`}
            placement="right"
            width={600}
            onClose={hide}
            extra={<WizardButtons {...wizard} isEditable={currentExplosiveObject?.isEditable} />}>
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
                                  size: currentExplosiveObject.details?.data.size?.map(el => ({
                                      ...el,
                                      length: el.length ? measurement.mToMm(el.length) : null,
                                      width: el.width ? measurement.mToMm(el.width) : null,
                                      height: el.height ? measurement.mToMm(el.height) : null,
                                  })),
                                  weight: currentExplosiveObject.details?.data.weight?.map(el => el.weight),
                                  purposeImageUris: currentExplosiveObject.details?.data.purpose?.imageUris ?? [],
                                  purposeDescription: currentExplosiveObject.details?.data.purpose?.description ?? '',
                                  structureImageUris: currentExplosiveObject.details?.data.structure?.imageUris ?? [],
                                  structureDescription: currentExplosiveObject.details?.data.structure?.description ?? '',
                                  actionImageUris: currentExplosiveObject.details?.data.action?.imageUris ?? [],
                                  actionDescription: currentExplosiveObject.details?.data.action?.description ?? '',
                                  imageUris: currentExplosiveObject?.details?.data?.imageUris
                                      ? currentExplosiveObject.details?.data.imageUris
                                      : [],
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
                    <Form.Item name="imageUris" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} style={{ marginTop: 16 }}>
                        <Form.Item noStyle shouldUpdate={() => true}>
                            {({ getFieldValue, setFieldValue }) => (
                                <UploadImages
                                    uris={getFieldValue('imageUris')}
                                    onChange={(uris: string[]) => setFieldValue('imageUris', uris)}
                                    customRequest={customRequest}
                                />
                            )}
                        </Form.Item>
                    </Form.Item>
                    {viewer.user?.isAuthor && (
                        <Form.Item label="Статус" name="status">
                            <Select options={explosiveObjectStatuses} />
                        </Form.Item>
                    )}
                    <Divider />
                    <Form.Item label="Маркування" name="name" rules={[{ required: true, message: "Є обов'язковим полем" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item label="Повна назва" name="fullName" rules={[{ message: "Є обов'язковим полем" }]}>
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
                        <Form.Item noStyle shouldUpdate={() => true}>
                            {({ getFieldValue, setFieldValue }) => {
                                const value = getFieldValue('component');

                                return (
                                    <Select
                                        options={explosiveObjectComponentData.map(el => ({
                                            label: el.name,
                                            value: el.id,
                                        }))}
                                        value={value}
                                        onChange={value => {
                                            setFieldValue('component', value);

                                            if (EXPLOSIVE_OBJECT_COMPONENT.FUSE === value) {
                                                setFieldValue('caliber', null);
                                                setFieldValue('fuseIds', null);
                                            }
                                        }}
                                    />
                                );
                            }}
                        </Form.Item>
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
                            const isVisibleForFuse = getFieldValue('component') === EXPLOSIVE_OBJECT_COMPONENT.AMMO;

                            return (
                                !!type?.data.hasCaliber &&
                                isVisibleForFuse && (
                                    <Form.Item label="Калібр" name="caliber">
                                        <InputNumber size="middle" min={1} max={100000} />
                                    </Form.Item>
                                )
                            );
                        }}
                    </Form.Item>
                    <Form.Item label="Скорочений опис" name="description">
                        <Input.TextArea placeholder="Введіть дані" maxLength={300} rows={3} />
                    </Form.Item>
                    <Divider />
                    <Form.Item label="Корпус" name="material">
                        <Select
                            options={materialsData.map(el => ({
                                label: el.name,
                                value: el.id,
                            }))}
                        />
                    </Form.Item>
                    <FieldMulty label="Вага, кг" name="weight" renderField={() => <InputNumber placeholder="Ввести" />} />
                    <FieldModal
                        label="Розмір, мм"
                        name="size"
                        modal={MODALS.SIZE_WIZARD}
                        getTitle={(item: ISizeData) => `${getSizeLabel(item)} (${item?.variant})`}
                        getDescription={item => item.name}
                    />
                    <FieldFiller label="Спорядження" name="filler" />
                    <Form.Item noStyle shouldUpdate={() => true}>
                        {({ getFieldValue, setFieldValue }) => {
                            const value = (getFieldValue('temperature') as ITempartureData) ?? {};

                            return (
                                <Form.Item label="Температура, °C" name="temperature">
                                    <InputNumber
                                        placeholder="Мін"
                                        onChange={min => setFieldValue('temperature', { ...value, min })}
                                        value={value?.min}
                                        css={s.size}
                                    />
                                    <InputNumber
                                        placeholder="Макс"
                                        onChange={max => setFieldValue('temperature', { ...value, max })}
                                        value={value?.max}
                                    />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                    <Divider />
                    <Form.Item noStyle shouldUpdate={() => true}>
                        {({ getFieldValue }) => getFieldValue('component') === EXPLOSIVE_OBJECT_COMPONENT.AMMO && <Fuse />}
                    </Form.Item>
                    <Divider />
                    <Form.Item noStyle shouldUpdate={() => true}>
                        {({ getFieldValue }) => getFieldValue('component') !== EXPLOSIVE_OBJECT_COMPONENT.FERVOR && <Fervor />}
                    </Form.Item>
                    <Divider />
                    <Form.Item label="Повний опис" name="fullDescription">
                        <Input.TextArea placeholder="Введіть дані" maxLength={2000} rows={8} />
                    </Form.Item>
                    <Divider />
                    <FieldSection label="Призначення" name="purposeImageUris" nameDesc="purposeDescription" />
                    <Divider />
                    <FieldSection label="Будова" name="structureImageUris" nameDesc="structureDescription" />
                    <Divider />
                    <FieldSection label="Принцип дії" name="actionImageUris" nameDesc="actionDescription" />
                    <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} loading={isSubmitting} />
                </Form>
            )}
        </Drawer>
    );
});
