import { useEffect } from 'react';

import { Form, Drawer, Spin, Input, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import { bookTypes, explosiveObjectStatuses, MIME_TYPE } from 'shared-my';

import { Upload, WizardButtons, WizardFooter } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';
import { AssetStorage } from '~/services';

import { s } from './book-wizard.style';
import { type IBookForm } from './book-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

export const BookWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const { book, viewer } = useStore();
    const wizard = useWizard({ id, mode });

    const currentBook = book.collection.get(id as string);

    const isEdit = !!id;
    const isLoading = book.fetchItem.isLoading;

    const onFinishCreate = async (values: IBookForm) => {
        await book.create.run({
            ...values,
            mime: MIME_TYPE.PDF,
        });
        hide();
    };

    const onFinishUpdate = async (values: IBookForm) => {
        await currentBook?.update.run({
            ...values,
            mime: MIME_TYPE.PDF,
        });
        hide();
    };

    const onRemove = () => {
        !!id && book.remove.run(id);
        hide();
    };

    useEffect(() => {
        !!id && book.fetchItem.run(id);
    }, [id]);

    const customRequestImage = (file: File) => AssetStorage.image.create(file);
    const customRequestBook = (file: File) => AssetStorage.book.create(file);

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} Книгу`}
            placement="right"
            width={600}
            onClose={hide}
            extra={<WizardButtons {...wizard} isEditable />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="explosive-object-form"
                    onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    disabled={wizard.isView}
                    initialValues={currentBook?.data ? { ...currentBook?.data } : {}}>
                    <Form.Item
                        name="imageUri"
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        rules={[{ required: true, message: "Є обов'язковим полем" }]}>
                        <Form.Item noStyle shouldUpdate={() => true}>
                            {({ getFieldValue, setFieldValue }) => {
                                const imageUri = getFieldValue('imageUri');
                                const onChangeFile = ({ url }: { url: string | null }) => setFieldValue('imageUri', url);

                                return (
                                    <Upload
                                        onChange={onChangeFile}
                                        customRequest={customRequestImage}
                                        type="image"
                                        accept={[MIME_TYPE.PNG, MIME_TYPE.JPG]}
                                        uri={imageUri}
                                    />
                                );
                            }}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        name="uri"
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        rules={[{ required: true, message: "Є обов'язковим полем" }]}>
                        <Form.Item noStyle shouldUpdate={() => true}>
                            {({ getFieldValue, setFieldValue }) => {
                                const fileUri = getFieldValue('uri');
                                const onChangeFile = ({ url, size }: { url: string | null; size: number | null }) => {
                                    setFieldValue('uri', url);
                                    setFieldValue('size', size);
                                };

                                return (
                                    <Upload
                                        onChange={onChangeFile}
                                        type="document"
                                        customRequest={customRequestBook}
                                        accept={MIME_TYPE.PDF}
                                        uri={fileUri}
                                    />
                                );
                            }}
                        </Form.Item>
                    </Form.Item>
                    {viewer.user?.isAuthor && (
                        <Form.Item label="Статус" name="status" rules={[{ required: true, message: "Є обов'язковим полем" }]}>
                            <Select options={explosiveObjectStatuses} />
                        </Form.Item>
                    )}
                    <Form.Item label="Назва" name="name" rules={[{ required: true, message: "Є обов'язковим полем" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item label="Тип" name="type" rules={[{ required: true, message: "Є обов'язковим полем" }]}>
                        <Select
                            options={bookTypes.map(el => ({
                                label: el.name,
                                value: el.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item label="Розмір" name="size">
                        <Input placeholder="Розмір" disabled />
                    </Form.Item>
                    <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} />
                </Form>
            )}
        </Drawer>
    );
});
