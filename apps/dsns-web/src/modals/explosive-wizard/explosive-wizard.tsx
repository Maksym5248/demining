import { useEffect } from 'react';

import { Form, Input, Drawer, InputNumber, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { MIME_TYPE } from 'shared-my';

import { UploadFile, WizardButtons, WizardFooter } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';

import { s } from './explosive-wizard.style';
import { type IExplosiveForm } from './explosive-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

export const ExplosiveWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const { explosive } = useStore();
    const wizard = useWizard({ id, mode });

    const currentExplosive = explosive.collection.get(id as string);

    const isEdit = !!id;
    const isLoading = explosive.fetchItem.isLoading;

    const onFinishCreate = async (values: IExplosiveForm) => {
        await explosive.create.run(values);
        hide();
    };

    const onFinishUpdate = async (values: IExplosiveForm) => {
        await currentExplosive?.update.run(values);
        hide();
    };

    const onRemove = () => {
        !!id && explosive.remove.run(id);
        hide();
    };

    useEffect(() => {
        !!id && explosive.fetchItem.run(id);
    }, [id]);

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} ВР`}
            placement="right"
            width={600}
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
                    initialValues={currentExplosive ? { ...currentExplosive.data } : {}}>
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
                    <Form.Item label="Назва" name="name" rules={[{ required: true, message: "Назва є обов'язковим полем" }]}>
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
                    <Form.Item noStyle shouldUpdate={() => true}>
                        {({ getFieldValue, setFieldValue }) => {
                            const detonation = getFieldValue('detonation') as {
                                velocity: number | null; // m/s
                            } | null;

                            return (
                                <Form.Item label="Швидкість детонації, м/c">
                                    <InputNumber
                                        onChange={(velocity) => setFieldValue('detonation', { velocity })}
                                        value={detonation?.velocity}
                                        min={0}
                                    />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={() => true}>
                        {({ getFieldValue, setFieldValue }) => {
                            const sensitivity = getFieldValue('sensitivity') as {
                                shock: string | null;
                                tempurture: string | null;
                            } | null;

                            return (
                                <>
                                    <Form.Item label="Чутливість: Удар">
                                        <Input
                                            placeholder="Введіть дані"
                                            onChange={(shock) => setFieldValue('detonation', { ...sensitivity, shock })}
                                            value={sensitivity?.shock ?? ''}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Температура">
                                        <Input
                                            placeholder="Введіть дані"
                                            onChange={(tempurture) => setFieldValue('detonation', { ...sensitivity, tempurture })}
                                            value={sensitivity?.tempurture ?? ''}
                                        />
                                    </Form.Item>
                                </>
                            );
                        }}
                    </Form.Item>
                    <Form.Item label="Плотність, г/см3" name="density">
                        <InputNumber placeholder="Ввести" />
                    </Form.Item>
                    <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} />
                </Form>
            )}
        </Drawer>
    );
});
