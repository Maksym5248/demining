import { Form, Drawer, Input, Spin, InputNumber, Divider } from 'antd';
import { observer } from 'mobx-react-lite';
import { EXPLOSIVE_DEVICE_TYPE, explosiveDeviceTypeData, explosiveObjectStatuses, measurement, MIME_TYPE } from 'shared-my';
import { useItemStore } from 'shared-my-client';

import { WizardButtons, Select, WizardFooter, UploadFile, FieldSize, FieldSection, FieldImageUris, FieldFiller } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';
import { AssetStorage } from '~/services';

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
    ...values
}: IExplosiveDeviceForm) => ({
    ...values,
    size: {
        length: size?.length ? measurement.mmToM(size?.length) : null,
        width: size?.width ? measurement.mmToM(size?.width) : null,
        height: size?.height ? measurement.mmToM(size?.height) : null,
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
});

export const ExplosiveDeviceWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const store = useStore();
    const wizard = useWizard({ id, mode });

    const { isLoading, item } = useItemStore(store.explosiveDevice, id as string);

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
            title={`${isEdit ? 'Редагувати' : 'Створити'} ВР та ЗП`}
            placement="right"
            width={500}
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
                    initialValues={
                        item
                            ? {
                                  ...item.data,
                                  size: {
                                      length: item?.data.size?.length ? measurement.mToMm(item?.data.size?.length) : null,
                                      width: item?.data.size?.width ? measurement.mToMm(item?.data.size?.width) : null,
                                      height: item?.data.size?.height ? measurement.mToMm(item?.data.size?.height) : null,
                                  },
                                  purposeImageUris: item?.data.purpose?.imageUris ?? [],
                                  purposeDescription: item?.data.purpose?.description ?? '',
                                  structureImageUris: item?.data.structure?.imageUris ?? [],
                                  structureDescription: item?.data.structure?.description ?? '',
                                  actionImageUris: item?.data.action?.imageUris ?? [],
                                  actionDescription: item?.data.action?.description ?? '',
                                  imageUris: item?.data?.imageUris ? item?.data.imageUris : [],
                              }
                            : { type: EXPLOSIVE_DEVICE_TYPE.EXPLOSIVE }
                    }>
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
                                    />
                                );
                            }}
                        </Form.Item>
                    </Form.Item>
                    <FieldImageUris name="imageUris" />
                    <Form.Item label="Тип" name="type" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select options={explosiveDeviceTypeData} />
                    </Form.Item>
                    {store.viewer.user?.isAuthor && (
                        <Form.Item label="Статус" name="status">
                            <Select options={explosiveObjectStatuses} />
                        </Form.Item>
                    )}
                    <Form.Item label="Назва" name="name" rules={[{ required: true, message: "Прізвище є обов'язковим полем" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <FieldSize name="size" />
                    <Form.Item label="Вага, кг" name="chargeWeight">
                        <InputNumber placeholder="Ввести" />
                    </Form.Item>
                    <FieldFiller label="Спорядження" name="filler" />
                    <Divider />
                    <FieldSection label="Призначення" name="purposeImageUris" nameDesc="purposeDescription" />
                    <Divider />
                    <FieldSection label="Будова" name="structureImageUris" nameDesc="structureDescription" />
                    <Divider />
                    <FieldSection label="Принцип дії" name="actionImageUris" nameDesc="actionDescription" />
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
