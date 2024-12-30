import { Form, Drawer, Input, Spin, Checkbox } from 'antd';
import { observer } from 'mobx-react-lite';
import { MIME_TYPE } from 'shared-my';
import { useItemStore } from 'shared-my-client';

import { UploadFile, WizardButtons, WizardFooter } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';

import { s } from './explosive-object-type-wizard.style';
import { type IExplosiveObjectTypeForm } from './explosive-object-type-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

export const ExplosiveObjectTypeWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const store = useStore();
    const wizard = useWizard({ id, mode });

    const { isLoading, item } = useItemStore(store.explosiveObject.type, id as string);

    const isEdit = !!id;

    const onFinishCreate = async (values: IExplosiveObjectTypeForm) => {
        await store.explosiveObject.type.create.run(values);
        hide();
    };

    const onFinishUpdate = async (values: IExplosiveObjectTypeForm) => {
        await item?.update.run(values);
        hide();
    };

    const onRemove = async () => {
        !!id && store.explosiveObject.type.remove.run(id);
        hide();
    };

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} тип`}
            placement="right"
            width={500}
            onClose={hide}
            extra={<WizardButtons {...wizard} />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="explosive-object.type"
                    onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    disabled={wizard.isView}
                    initialValues={item ? { ...item.data } : { hasCaliber: false }}>
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
                    <Form.Item label="Скорочена назва" name="name" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item label="Повна назва" name="fullName" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item label="Калібр" name="hasCaliber" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Checkbox />
                    </Form.Item>
                    <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} />
                </Form>
            )}
        </Drawer>
    );
});
