import { useEffect } from 'react';

import { Form, Input, Drawer, InputNumber, Spin, Divider, Space, Tabs } from 'antd';
import { observer } from 'mobx-react-lite';
import { EXPLOSIVE_OBJECT_COMPONENT, APPROVE_STATUS, measurement, MIME_TYPE } from 'shared-my';
import { type IExplosiveObjectType, type IExplosiveObject, type IFieldData, type ISizeData } from 'shared-my-client';

import {
    FieldFiller,
    FieldMaterial,
    FieldModal,
    FieldMulty,
    FieldRange,
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
import { select, str } from '~/utils';

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
    targetSensor,
    sensitivityEffort,
    sensitivitySensitivity,
    sensitivityAdditional,
    timeWork,
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
    liquidatorImageUris,
    liquidatorDescription,
    extractionImageUris,
    extractionDescription,
    foldingImageUris,
    foldingDescription,
    installationDescription,
    installationImageUris,
    neutralizationDescription,
    neutralizationImageUris,
    markingImageUris,
    markingDescription,
    historicalImageUris,
    historicalDescription,
    additional,
    liquidatorShort,
    foldingShort,
    extractionShort,
    damageRadius,
    damageDistance,
    damageSquad,
    damageHeight,
    damageNumber,
    damageAction,
    damageAdditional,
    ...values
}: IExplosiveObjectForm) => ({
    ...values,
    details: {
        additional: additional?.filter(el => !!el) ?? [],
        imageUris,
        caliber,
        material: material?.filter(el => !!el) ?? [],
        fullDescription,
        liquidatorShort,
        foldingShort,
        extractionShort,
        sensitivity: {
            effort: sensitivityEffort,
            sensitivity: sensitivitySensitivity,
            additional: sensitivityAdditional?.filter(el => !!el) ?? [],
        },
        damage: {
            radius: damageRadius,
            distance: damageDistance,
            squad: damageSquad,
            height: damageHeight,
            number: damageNumber,
            action: damageAction,
            additional: damageAdditional?.filter(el => !!el) ?? [],
        },
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
        targetSensor,
        timeWork,
        filler: filler ?? [],
        fuseIds: fuseIds?.filter(el => !!el) ?? [],
        fervorIds: fervorIds?.filter(el => !!el) ?? [],
        liquidator: {
            imageUris: liquidatorImageUris,
            description: liquidatorDescription,
        },
        extraction: {
            imageUris: extractionImageUris,
            description: extractionDescription,
        },
        folding: {
            imageUris: foldingImageUris,
            description: foldingDescription,
        },
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
        installation: {
            imageUris: installationImageUris,
            description: installationDescription,
        },
        neutralization: {
            imageUris: neutralizationImageUris,
            description: neutralizationDescription,
        },
        marking: {
            imageUris: markingImageUris,
            description: markingDescription,
        },
        historical: {
            imageUris: historicalImageUris,
            description: historicalDescription,
        },
    },
});

const createInitialValues = (item?: IExplosiveObject, firstType?: IExplosiveObjectType) => {
    if (!item) {
        return {
            typeId: firstType?.data.id,
            status: APPROVE_STATUS.PENDING,
            classItemIds: [],
        };
    }

    const {
        action,
        liquidator,
        extraction,
        folding,
        marking,
        installation,
        neutralization,
        historical,
        sensitivity,
        imageUris,
        weight,
        purpose,
        structure,
        damage,
    } = item.details?.data || {};

    return {
        ...item.data,
        ...item.details?.data,
        damageRadius: damage?.radius,
        damageDistance: damage?.distance,
        damageSquad: damage?.squad,
        damageHeight: damage?.height,
        damageNumber: damage?.number,
        damageAction: damage?.action,
        damageAdditional: item.details?.data.damage?.additional ?? [],
        size: item.details?.data.size?.map(el => ({
            ...el,
            length: el.length ? measurement.mToMm(el.length) : null,
            width: el.width ? measurement.mToMm(el.width) : null,
            height: el.height ? measurement.mToMm(el.height) : null,
        })),
        weight: weight?.map(el => el.weight),
        purposeImageUris: purpose?.imageUris ?? [],
        purposeDescription: purpose?.description ?? '',
        structureImageUris: structure?.imageUris ?? [],
        structureDescription: structure?.description ?? '',
        actionImageUris: action?.imageUris ?? [],
        actionDescription: action?.description ?? '',
        liquidatorImageUris: liquidator?.imageUris ?? [],
        liquidatorDescription: liquidator?.description ?? '',
        extractionImageUris: extraction?.imageUris ?? [],
        extractionDescription: extraction?.description ?? '',
        foldingImageUris: folding?.imageUris ?? [],
        foldingDescription: folding?.description ?? '',
        markingImageUris: marking?.imageUris ?? [],
        markingDescription: marking?.description ?? '',
        installationImageUris: installation?.imageUris ?? [],
        installationDescription: installation?.description ?? '',
        neutralizationImageUris: neutralization?.imageUris ?? [],
        neutralizationDescription: neutralization?.description ?? '',
        historicalImageUris: historical?.imageUris ?? [],
        historicalDescription: historical?.description ?? '',
        sensitivitySensitivity: sensitivity?.sensitivity,
        sensitivityAdditional: sensitivity?.additional ?? [],
        sensitivityEffort: sensitivity?.effort,
        imageUris: imageUris ? imageUris : [],
    };
};

export const ExplosiveObjectWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const { explosiveObject, viewer, common } = useStore();

    const item = explosiveObject.collection.get(id as string);

    const wizard = useWizard({
        id,
        mode,
        permissions: {
            edit: !!item?.isEditable,
            remove: !!item?.isRemovable,
        },
    });

    const isLoading = explosiveObject.fetchItem.isLoading;
    const firstType = explosiveObject.type.list.first;

    const onFinishCreate = async (values: IExplosiveObjectForm) => {
        await explosiveObject.create.run(getParams(values));
        hide();
    };

    const onFinishUpdate = async (values: IExplosiveObjectForm) => {
        await item?.update.run(getParams(values));
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

    const isSubmitting = explosiveObject.create.isLoading || !!item?.update?.isLoading;

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={str.getTitle(wizard, item?.displayName ?? '')}
            placement="right"
            width={900}
            onClose={hide}
            extra={<WizardButtons {...wizard} isEditable={item?.isEditable} />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="explosive-object-form"
                    onFinish={wizard.isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    disabled={wizard.isView}
                    initialValues={createInitialValues(item, firstType)}>
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
                    {viewer?.permissions.dictionary.approve() && (
                        <Form.Item label="Статус" name="status">
                            <Select
                                options={common.collections.statuses.asArray.map(el => ({
                                    value: el.id,
                                    label: el.displayName,
                                }))}
                            />
                        </Form.Item>
                    )}
                    <Divider />
                    <Tabs
                        defaultActiveKey="1"
                        items={[
                            {
                                label: 'Загальні дані',
                                key: 'main',
                                children: (
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        <Form.Item
                                            label="Маркування"
                                            name="name"
                                            rules={[{ required: true, message: "Є обов'язковим полем" }]}>
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
                                                        label: item?.type?.displayName,
                                                        value: item?.type?.data.id,
                                                    },
                                                )}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Частина"
                                            name="component"
                                            rules={[{ required: true, message: "Обов'язкове поле" }]}>
                                            <Form.Item noStyle shouldUpdate={() => true}>
                                                {({ getFieldValue, setFieldValue }) => {
                                                    const value = getFieldValue('component');

                                                    return (
                                                        <Select
                                                            options={explosiveObject.collectionComponents.asArray.map(el => ({
                                                                label: el.displayName,
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
                                        <Form.Item
                                            label="Країна"
                                            name="countryId"
                                            rules={[{ required: true, message: "Обов'язкове поле" }]}>
                                            <Select
                                                options={common.collections.countries.asArray.map(el => ({
                                                    label: el.data.name,
                                                    value: el.data.id,
                                                }))}
                                            />
                                        </Form.Item>
                                        <Form.Item noStyle shouldUpdate={() => true}>
                                            {({ getFieldValue, setFieldValue }) => {
                                                const typeId = getFieldValue('typeId');
                                                const component = getFieldValue('component');

                                                return (
                                                    <Classification typeId={typeId} component={component} setFieldValue={setFieldValue} />
                                                );
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
                                        <Form.Item label="Повний опис" name="fullDescription">
                                            <Input.TextArea placeholder="Введіть дані" rows={8} />
                                        </Form.Item>
                                    </Space>
                                ),
                            },
                            {
                                label: 'Ініціація',
                                key: 'initiation',
                                children: (
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        <Form.Item noStyle shouldUpdate={() => true}>
                                            {({ getFieldValue }) =>
                                                (getFieldValue('component') === EXPLOSIVE_OBJECT_COMPONENT.AMMO ||
                                                    getFieldValue('component') === EXPLOSIVE_OBJECT_COMPONENT.EXPLOSIVE_DEVICE) && <Fuse />
                                            }
                                        </Form.Item>
                                        <Form.Item noStyle shouldUpdate={() => true}>
                                            {({ getFieldValue }) =>
                                                getFieldValue('component') !== EXPLOSIVE_OBJECT_COMPONENT.FERVOR && <Fervor />
                                            }
                                        </Form.Item>
                                        <Form.Item label="Підривник" name="targetSensor">
                                            <Input.TextArea placeholder="Введіть дані" maxLength={300} rows={2} />
                                        </Form.Item>
                                        <FieldRange label="Зусилля спрацювання, кг" name="sensitivityEffort" />
                                        <Form.Item label="Чутливість" name="sensitivitySensitivity">
                                            <Input placeholder="Введіть дані" />
                                        </Form.Item>
                                        <FieldMulty
                                            label="Додаткові чутливість"
                                            name="sensitivityAdditional"
                                            manual
                                            renderField={({ value, update }: { value: IFieldData; update: (v: IFieldData) => void }) => (
                                                <div css={s.additional}>
                                                    <Input
                                                        css={s.input}
                                                        placeholder="Назва"
                                                        value={value?.name}
                                                        onChange={e =>
                                                            update({
                                                                ...(value ?? {}),
                                                                name: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <Input
                                                        placeholder="Значення"
                                                        value={value?.value}
                                                        onChange={e =>
                                                            update({
                                                                ...(value ?? {}),
                                                                value: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            )}
                                        />
                                        <Form.Item label="Час самоліквідації" name="liquidatorShort">
                                            <Input placeholder="Введіть дані" />
                                        </Form.Item>
                                        <Form.Item label="Час зведення" name="foldingShort">
                                            <Input placeholder="Введіть дані" />
                                        </Form.Item>
                                        <Form.Item label="Механізм невилучення" name="extractionShort">
                                            <Input placeholder="Введіть дані" />
                                        </Form.Item>
                                    </Space>
                                ),
                            },
                            {
                                label: 'Ураження',
                                key: 'demage',
                                children: (
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        <FieldFiller label="Спорядження" name="filler" />
                                        <FieldRange label="Радіус суцільного ураження, м" name="damageRadius" />
                                        <FieldRange label="Дальність дольоту окремих осколків, м" name="damageDistance" />
                                        <FieldRange label="Площа ураження, м2" name="damageSquad" />
                                        <FieldRange label="Висота ураження, м" name="damageHeight" />
                                        <FieldRange label="Кількість уражаючих елементів, м" name="damageNumber" />
                                        <Form.Item label="Вражаюча дія" name="damageAction">
                                            <Input placeholder="Введіть дані" />
                                        </Form.Item>
                                        <FieldMulty
                                            label="Додаткові"
                                            name="damageAdditional"
                                            manual
                                            renderField={({ value, update }: { value: IFieldData; update: (v: IFieldData) => void }) => (
                                                <div css={s.additional}>
                                                    <Input
                                                        css={s.input}
                                                        placeholder="Назва"
                                                        value={value?.name}
                                                        onChange={e =>
                                                            update({
                                                                ...(value ?? {}),
                                                                name: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <Input
                                                        placeholder="Значення"
                                                        value={value?.value}
                                                        onChange={e =>
                                                            update({
                                                                ...(value ?? {}),
                                                                value: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            )}
                                        />
                                    </Space>
                                ),
                            },
                            {
                                label: 'Додаткові',
                                key: 'additional',
                                children: (
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        <Form.Item label="Час роботи" name="timeWork">
                                            <Input.TextArea placeholder="Введіть дані" maxLength={300} rows={2} />
                                        </Form.Item>
                                        <FieldRange label="Температура, °C" name="temperature" />
                                        <FieldMaterial />
                                        <FieldMulty
                                            label="Вага, кг"
                                            name="weight"
                                            renderField={() => <InputNumber placeholder="Ввести" />}
                                        />
                                        <FieldModal
                                            label="Розмір, мм"
                                            name="size"
                                            modal={MODALS.SIZE_WIZARD}
                                            getTitle={(item: ISizeData) => getSizeLabel(item)}
                                            getDescription={item => item.name}
                                        />
                                        <FieldMulty
                                            label="Додаткові"
                                            name="additional"
                                            manual
                                            renderField={({ value, update }: { value: IFieldData; update: (v: IFieldData) => void }) => (
                                                <div css={s.additional}>
                                                    <Input
                                                        css={s.input}
                                                        placeholder="Назва"
                                                        value={value?.name}
                                                        onChange={e =>
                                                            update({
                                                                ...(value ?? {}),
                                                                name: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <Input
                                                        placeholder="Значення"
                                                        value={value?.value}
                                                        onChange={e =>
                                                            update({
                                                                ...(value ?? {}),
                                                                value: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            )}
                                        />
                                    </Space>
                                ),
                            },
                            {
                                label: 'Детально',
                                key: 'detailed',
                                children: (
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        <FieldSection
                                            label="Історична довідка"
                                            name="historicalImageUris"
                                            nameDesc="historicalDescription"
                                        />
                                        <Divider />
                                        <FieldSection label="Призначення" name="purposeImageUris" nameDesc="purposeDescription" />
                                        <Divider />
                                        <FieldSection label="Будова" name="structureImageUris" nameDesc="structureDescription" />
                                        <Divider />
                                        <FieldSection label="Зведення" name="foldingImageUris" nameDesc="foldingDescription" />
                                        <Divider />
                                        <FieldSection label="Принцип дії" name="actionImageUris" nameDesc="actionDescription" />
                                        <Divider />
                                        <FieldSection label="Невилучення" name="extractionImageUris" nameDesc="extractionDescription" />
                                        <Divider />
                                        <FieldSection label="Самоліквідатор" name="liquidatorImageUris" nameDesc="liquidatorDescription" />
                                        <Divider />
                                        <FieldSection
                                            label="Встановлення"
                                            name="installationImageUris"
                                            nameDesc="installationDescription"
                                        />
                                        <Divider />
                                        <FieldSection
                                            label="Знешкодження"
                                            name="neutralizationImageUris"
                                            nameDesc="neutralizationDescription"
                                        />
                                        <Divider />
                                        <FieldSection label="Маркування" name="markingImageUris" nameDesc="markingDescription" />
                                    </Space>
                                ),
                            },
                        ]}
                    />
                    <Divider />
                    <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} loading={isSubmitting} />
                </Form>
            )}
        </Drawer>
    );
});
