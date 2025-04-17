import { useEffect } from 'react';

import { Form, Input, Drawer, Spin, Divider, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import { MIME_TYPE, explosiveObjectStatuses, measurement } from 'shared-my';
import { type IFieldData } from 'shared-my-client';

import { FieldMulty, FieldRange, UploadFile, UploadImages, WizardButtons, WizardFooter } from '~/components';
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
    additional,
    ...value
}: IExplosiveForm) => {
    return {
        ...value,
        additional: additional?.filter(el => !!el) ?? [],
        explosive: {
            velocity: velocity ?? null,
            brisantness: {
                min: brisantness?.min ? measurement.mmToM(brisantness.min) : null,
                max: brisantness?.max ? measurement.mmToM(brisantness.max) : null,
            },
            explosiveness: {
                min: explosiveness?.min ? measurement.cm3ToM3(explosiveness.min) : null,
                max: explosiveness?.max ? measurement.cm3ToM3(explosiveness.max) : null,
            },
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

    const customRequest = (file: File) => AssetStorage.image.create(file);

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} ВР`}
            placement="right"
            width={900}
            onClose={hide}
            extra={<WizardButtons {...wizard} isEditable={!!currentExplosive?.isEditable} />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="explosive-object-form"
                    onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    disabled={wizard.isView}
                    initialValues={
                        currentExplosive
                            ? {
                                  ...currentExplosive.data,
                                  ...currentExplosive.data.sensitivity,
                                  ...currentExplosive.data.explosive,
                                  ...currentExplosive.data.physical,
                                  explosiveness: {
                                      min: currentExplosive.data.explosive?.explosiveness?.min
                                          ? measurement.m3ToCm3(currentExplosive.data.explosive.explosiveness.min)
                                          : null,
                                      max: currentExplosive.data.explosive?.explosiveness?.max
                                          ? measurement.m3ToCm3(currentExplosive.data.explosive.explosiveness.max)
                                          : null,
                                  },
                                  brisantness: {
                                      min: currentExplosive.data.explosive?.brisantness?.min
                                          ? measurement.mToMm(currentExplosive.data.explosive.brisantness.min)
                                          : null,
                                      max: currentExplosive.data.explosive?.brisantness?.max
                                          ? measurement.mToMm(currentExplosive.data.explosive.brisantness.max)
                                          : null,
                                  },
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
                    {viewer.user?.permissions.ammo.approve() && (
                        <Form.Item label="Статус" name="status">
                            <Select options={explosiveObjectStatuses} />
                        </Form.Item>
                    )}
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
                    <FieldRange label="Швидкість детонації, м/c" name="velocity" min={0} />
                    <FieldRange label="Брезантність, мм" name="brisantness" min={0} />
                    <FieldRange label="Фугасність, см³" name="explosiveness" min={0} />
                    <FieldRange label="Тротиловий еквівалент" name="tnt" min={0} />
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
                    <FieldRange label="Плотність, кг/м³" name="density" min={0} />
                    <FieldRange label="Т плавлення, ºС" name="meltingPoint" min={0} />
                    <FieldRange label="Т запалення, ºС" name="ignitionPoint" min={0} />
                    <Divider />
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
                    <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} />
                </Form>
            )}
        </Drawer>
    );
});
