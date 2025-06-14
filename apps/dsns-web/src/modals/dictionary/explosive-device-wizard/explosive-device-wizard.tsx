import { Form, Drawer, Input, Spin, InputNumber, Divider, Space, Tabs } from 'antd';
import { observer } from 'mobx-react-lite';
import { EXPLOSIVE_DEVICE_TYPE, measurement, MIME_TYPE } from 'shared-my';
import { type ISizeData, useItemStore, type IFieldData, getSizeLabel, type IExplosiveDevice } from 'shared-my-client';

import {
    WizardButtons,
    Select,
    WizardFooter,
    UploadFile,
    FieldSection,
    FieldImageUris,
    FieldFiller,
    FieldModal,
    FieldMulty,
    FieldMaterial,
} from '~/components';
import { MODALS, type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';
import { AssetStorage } from '~/services';
import { str } from '~/utils';

import { s } from './explosive-device-wizard.style';
import { type IExplosiveDeviceForm } from './explosive-device-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

const getParams = ({
    size,
    purposeImageUris,
    purposeDescription,
    structureImageUris,
    structureDescription,
    actionImageUris,
    actionDescription,
    markingImageUris,
    markingDescription,
    usageDescription,
    usageImageUris,
    additional,
    ...values
}: IExplosiveDeviceForm) => ({
    ...values,
    additional: additional?.filter(el => !!el) ?? [],
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
    marking: {
        imageUris: markingImageUris,
        description: markingDescription,
    },
    usage: {
        imageUris: usageImageUris,
        description: usageDescription,
    },
});

const getInitialValues = (item?: IExplosiveDevice) => {
    return item
        ? {
              ...item.data,
              size: item?.data.size?.map(el => ({
                  ...el,
                  length: el.length ? measurement.mToMm(el.length) : null,
                  width: el.width ? measurement.mToMm(el.width) : null,
                  height: el.height ? measurement.mToMm(el.height) : null,
              })),
              purposeImageUris: item?.data.purpose?.imageUris ?? [],
              purposeDescription: item?.data.purpose?.description ?? '',
              structureImageUris: item?.data.structure?.imageUris ?? [],
              structureDescription: item?.data.structure?.description ?? '',
              actionImageUris: item?.data.action?.imageUris ?? [],
              actionDescription: item?.data.action?.description ?? '',
              markingImageUris: item?.data.marking?.imageUris ?? [],
              markingDescription: item?.data.marking?.description ?? '',
              imageUris: item?.data?.imageUris ? item?.data.imageUris : [],
          }
        : { type: EXPLOSIVE_DEVICE_TYPE.EXPLOSIVE };
};

export const ExplosiveDeviceWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const store = useStore();

    const { isLoading, item } = useItemStore(store.explosiveDevice, id as string);

    const wizard = useWizard({
        id,
        mode,
        permissions: {
            edit: !!item?.isEditable,
            remove: !!item?.isRemovable,
        },
    });

    const isEdit = !!id;

    const onFinishCreate = async (values: IExplosiveDeviceForm) => {
        await store.explosiveDevice.create.run(getParams(values));
        hide();
    };

    const onFinishUpdate = async (values: IExplosiveDeviceForm) => {
        await item?.update.run(getParams(values));
        hide();
    };

    const onRemove = async () => {
        !!id && store.explosiveDevice.remove.run(id);
        hide();
    };

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={str.getTitle(wizard, item?.displayName)}
            placement="right"
            width={800}
            onClose={hide}
            extra={<WizardButtons {...wizard} isEditable={!!item?.isEditable} />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="explosive-form"
                    onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    disabled={wizard.isView}
                    initialValues={getInitialValues(item)}>
                    <Form.Item name="imageUri" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                        <Form.Item noStyle shouldUpdate={() => true}>
                            {({ getFieldValue, setFieldValue }) => {
                                const imageUri = getFieldValue('imageUri');

                                const onChangeFile = async ({ file }: { file: File | null }) => {
                                    if (!file) return;

                                    const uri = await AssetStorage.image.create(file);
                                    setFieldValue('imageUri', uri);
                                };

                                return (
                                    <UploadFile
                                        onChangeFile={onChangeFile}
                                        type="image"
                                        accept={[MIME_TYPE.PNG, MIME_TYPE.JPG]}
                                        uri={imageUri}
                                        style={{ maxHeight: 400 }}
                                    />
                                );
                            }}
                        </Form.Item>
                    </Form.Item>
                    <FieldImageUris name="imageUris" />
                    {store.viewer?.permissions.dictionary.approve() && (
                        <Form.Item label="Статус" name="status">
                            <Select
                                options={store.common.collections.statuses.asArray.map(el => ({
                                    value: el.id,
                                    label: el.displayName,
                                }))}
                            />
                        </Form.Item>
                    )}
                    <Tabs
                        defaultActiveKey="1"
                        items={[
                            {
                                key: '1',
                                label: 'Загальні дані',
                                children: (
                                    <Space direction="vertical" size="middle" style={{ width: '100%', gap: 0 }}>
                                        <Form.Item label="Тип" name="type" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                                            <Select
                                                options={store.explosiveDevice.collectionType.asArray.map(el => ({
                                                    value: el.id,
                                                    label: el.displayName,
                                                }))}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Назва"
                                            name="name"
                                            rules={[{ required: true, message: "Прізвище є обов'язковим полем" }]}>
                                            <Input placeholder="Введіть дані" />
                                        </Form.Item>
                                    </Space>
                                ),
                            },
                            {
                                label: 'Ураження',
                                key: 'demage',
                                children: (
                                    <Space direction="vertical" size="middle" style={{ width: '100%', gap: 0 }}>
                                        <FieldFiller label="Спорядження" name="filler" />
                                    </Space>
                                ),
                            },
                            {
                                label: 'Додаткові',
                                key: 'additional',
                                children: (
                                    <Space direction="vertical" size="middle" style={{ width: '100%', gap: 0 }}>
                                        <FieldModal
                                            label="Розмір, мм"
                                            name="size"
                                            modal={MODALS.SIZE_WIZARD}
                                            getTitle={(item: ISizeData) => getSizeLabel(item)}
                                            getDescription={item => item.name}
                                        />
                                        <Form.Item label="Вага, кг" name="chargeWeight">
                                            <InputNumber placeholder="Ввести" />
                                        </Form.Item>
                                        <FieldMaterial />
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
                                    <Space direction="vertical" size="middle" style={{ width: '100%', gap: 0 }}>
                                        <FieldSection label="Маркування" name="markingImageUris" nameDesc="markingDescription" />
                                        <Divider />
                                        <FieldSection label="Призначення" name="purposeImageUris" nameDesc="purposeDescription" />
                                        <Divider />
                                        <FieldSection label="Будова" name="structureImageUris" nameDesc="structureDescription" />
                                        <Divider />
                                        <FieldSection label="Принцип дії" name="actionImageUris" nameDesc="actionDescription" />
                                        <Divider />
                                        <FieldSection label="Використання та безпека" name="usageImageUris" nameDesc="usageDescription" />
                                    </Space>
                                ),
                            },
                        ]}
                    />
                    <Divider />
                    <WizardFooter
                        {...wizard}
                        onCancel={hide}
                        onRemove={onRemove}
                        loading={store.explosive.create.isLoading || item?.update.isLoading}
                    />
                </Form>
            )}
        </Drawer>
    );
});
