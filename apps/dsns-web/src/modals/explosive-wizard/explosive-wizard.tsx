import { useEffect } from 'react';

import { Form, Input, Drawer, InputNumber, Spin, Divider } from 'antd';
import { observer } from 'mobx-react-lite';
import { MIME_TYPE, measurement } from 'shared-my';
import uuid from 'uuid';

import { UploadFile, UploadImages, WizardButtons, WizardFooter } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';
import { AssetStorage } from '~/services';

import { Сomposition } from './components';
import { s } from './explosive-wizard.style';
import { type IExplosiveForm } from './explosive-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

const getParams = ({
    velocity,
    brisantness,
    explosiveness,
    shock,
    temperature,
    density,
    friction,
    meltingPoint,
    ignitionPoint,
    tnt,
    ...value
}: IExplosiveForm) => {
    return {
        ...value,
        explosive: {
            velocity: velocity ?? null,
            brisantness: brisantness ? measurement.mmToM(brisantness) : null,
            explosiveness: explosiveness ? measurement.cm3ToM3(explosiveness) : null,
            tnt: tnt ?? null,
        },
        sensitivity: {
            shock,
            temperature,
            friction,
        },
        physical: {
            density: density,
            meltingPoint,
            ignitionPoint,
        },
    };
};

export const ExplosiveWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const { explosive, viewer } = useStore();
    const wizard = useWizard({ id, mode });

    const currentExplosive = explosive.collection.get(id as string);

    const isEdit = !!id;
    const isLoading = explosive.fetchItem.isLoading;

    const onFinishCreate = async (values: IExplosiveForm) => {
        console.log('onFinishCreate', values);
        await explosive.create.run(getParams(values));
        hide();
    };

    const onFinishUpdate = async (values: IExplosiveForm) => {
        await currentExplosive?.update.run(getParams(values));
        hide();
    };

    const onRemove = () => {
        !!id && explosive.remove.run(id);
        hide();
    };

    useEffect(() => {
        !!id && explosive.fetchItem.run(id);
    }, [id]);

    const customRequest = async (file: File) => {
        const id = uuid.v4();
        await AssetStorage.image.save(id, file);
        const downloadURL = await AssetStorage.image.getFileUrl(id);
        return downloadURL;
    };

    const isEditable = !!viewer.user?.isAuthor || !!currentExplosive?.isCurrentOrganization;

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} ВР`}
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
                        currentExplosive
                            ? {
                                  ...currentExplosive.data,
                                  ...currentExplosive.data.sensitivity,
                                  ...currentExplosive.data.explosive,
                                  ...currentExplosive.data.physical,
                                  explosiveness: currentExplosive.data.explosive?.explosiveness
                                      ? measurement.m3ToCm3(currentExplosive.data.explosive.explosiveness)
                                      : null,
                                  brisantness: currentExplosive.data.explosive?.brisantness
                                      ? measurement.mToMm(currentExplosive.data.explosive.brisantness)
                                      : null,
                              }
                            : {}
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
                    <Form.Item label="Назва" name="name" rules={[{ required: true, message: "Є обов'язковим полем" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item label="Повна назва" name="fullName">
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item label="Формула" name="formula">
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item label="Опис" name="description">
                        <Input.TextArea placeholder="Введіть дані" maxLength={300} />
                    </Form.Item>
                    <Divider />
                    <Сomposition />
                    <Divider />
                    <Form.Item label="Швидкість детонації, м/c" name="velocity">
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item label="Брезантність, мм" name="brisantness">
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item label="Фугасність, см³" name="explosiveness">
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item label="Тротиловий еквівалент" name="tnt">
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item label="Чутливість до удару" name="shock">
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item label="до температури" name="temperature">
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item label="до тертя" name="friction">
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Divider />
                    <Form.Item label="Плотність, кг/м³" name="density">
                        <InputNumber placeholder="Ввести" />
                    </Form.Item>
                    <Form.Item label="Т плавлення, ºС" name="meltingPoint">
                        <InputNumber placeholder="Ввести" />
                    </Form.Item>
                    <Form.Item label="Т запалення, ºС" name="ignitionPoint">
                        <InputNumber placeholder="Ввести" />
                    </Form.Item>
                    <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} />
                </Form>
            )}
        </Drawer>
    );
});
