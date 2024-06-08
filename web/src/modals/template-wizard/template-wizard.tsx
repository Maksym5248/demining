import { useEffect, useState } from 'react';

import { Form, Drawer, Input, Spin, message } from 'antd';
import { observer } from 'mobx-react-lite';

import { WizardButtons, Select, WizardFooter, UploadFile } from '~/components';
import { ASSET_TYPE, DOCUMENT_TYPE, MIME_TYPE, MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';
import { Modal } from '~/services';
import { str } from '~/utils';

import { s } from './template-wizard.style';
import { IDocumentForm } from './template-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

const typeOptions = [
    {
        label: str.getValue(DOCUMENT_TYPE.MISSION_REPORT),
        value: DOCUMENT_TYPE.MISSION_REPORT,
    },
    {
        label: str.getValue(DOCUMENT_TYPE.ORDER),
        value: DOCUMENT_TYPE.ORDER,
    },
];

export const TemplateWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const store = useStore();
    const wizard = useWizard({ id, mode });
    const [file, setFile] = useState<File | null>(null);

    const document = store.document.collection.get(id ?? '');

    useEffect(() => {
        store.document.fetchTemplatesList.run();
    }, []);

    const isEdit = !!id;
    const isLoading =
        store.document.fetchTemplatesList.inProgress ||
        store.document.create.inProgress ||
        document?.update?.inProgress ||
        document?.load?.inProgress;

    const onFinishCreate = async (values: IDocumentForm) => {
        if (!file) {
            message.error('Немає доданого шаблону');
        }

        const data = {
            ...values,
            type: ASSET_TYPE.DOCUMENT,
            mime: MIME_TYPE.DOCX,
        };

        await store.document.create.run(data, file);
        hide();
    };

    const onFinishUpdate = async (values: IDocumentForm) => {
        const data = {
            ...values,
            type: ASSET_TYPE.DOCUMENT,
            mime: MIME_TYPE.DOCX,
        };

        await document.update.run(data, file);
        hide();
    };

    const onOpenDocument = async () => {
        const loadedFile = await document.load.run();

        Modal.show(MODALS.DOCX_PREVIEW, { file: file || loadedFile, name: document.name });
    };

    const onRemove = async () => {
        store.document.remove.run(id);
        hide();
    };

    const onChangeFile = (item: { file: File }) => {
        setFile(item.file);
    };

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} шаблон`}
            placement="right"
            width={500}
            onClose={hide}
            extra={<WizardButtons onSave={onOpenDocument} {...wizard} />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="document-template-form"
                    onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    disabled={wizard.isView}
                    initialValues={
                        document ? { ...document } : { documentType: DOCUMENT_TYPE.MISSION_REPORT }
                    }>
                    <Form.Item
                        label="Назва"
                        name="name"
                        rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item
                        label="Тип"
                        name="documentType"
                        rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select options={typeOptions} />
                    </Form.Item>
                    <UploadFile onChangeFile={onChangeFile} file={file} />
                    <div style={{ height: 16 }} />
                    <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} />
                </Form>
            )}
        </Drawer>
    );
});
