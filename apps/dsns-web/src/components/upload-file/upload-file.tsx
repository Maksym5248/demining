import { Image, Upload } from 'antd';
import { type RcFile } from 'antd/es/upload';
import { MIME_TYPE } from 'shared-my/db';

import { Icon } from '../icon';

interface SelectTemplateProps {
    file: File | null;
    onChangeFile: (options: { file: File | null }) => void;
    accept?: string;
    type?: 'document' | 'image';
    uri?: string;
}

const { Dragger } = Upload;

export function UploadFile({ type = 'document', uri, file, onChangeFile, accept = MIME_TYPE.DOCX }: SelectTemplateProps) {
    const isImagePreview = !!(file || uri);

    return (
        <Dragger
            openFileDialogOnClick
            fileList={file ? [file as RcFile] : undefined}
            customRequest={(value) => onChangeFile && onChangeFile(value as { file: File })}
            onRemove={() => onChangeFile({ file: null })}
            maxCount={1}
            accept={accept}>
            {type === 'document' && (
                <>
                    <p className="ant-upload-drag-icon">
                        <Icon.InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Натисніть або перетягніть файл у цю область, щоб завантажити</p>
                    <p className="ant-upload-hint">Вибрати шаблон</p>
                </>
            )}
            {!isImagePreview && !file && (
                <p className="ant-upload-drag-icon">
                    <p className="ant-upload-text">Натисніть або перетягніть картинку у цю область, щоб завантажити</p>
                    <Icon.InboxOutlined />
                </p>
            )}
            {isImagePreview && <Image src={file ? URL.createObjectURL(file) : uri} alt="image" preview={false} />}
        </Dragger>
    );
}
