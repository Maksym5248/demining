import { Image, Upload } from 'antd';
import { type RcFile } from 'antd/es/upload';
import { isArray } from 'lodash';
import { MIME_TYPE } from 'shared-my';

import { Icon } from '../icon';

/**
 * Do not use this component for loading images, use UploadImages instead
 */
interface SelectTemplateProps {
    file?: File | null;
    onChangeFile: (options: { file: File | null }) => void;
    accept?: string | string[];
    type?: 'document' | 'image';
    uri?: string;
}

const { Dragger } = Upload;

export function UploadFile({ type = 'document', uri, file, onChangeFile, accept = MIME_TYPE.DOCX }: SelectTemplateProps) {
    const isPreview = !!(file || uri);
    const isDocument = type === 'document';
    const isImage = type === 'image';

    return (
        <Dragger
            openFileDialogOnClick
            fileList={file ? [file as RcFile] : undefined}
            customRequest={value => onChangeFile && onChangeFile(value as { file: File })}
            onRemove={() => onChangeFile({ file: null })}
            maxCount={1}
            accept={isArray(accept) ? accept.join(', ') : accept}>
            {isDocument && (
                <>
                    <p className="ant-upload-drag-icon">
                        <Icon.InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Натисніть або перетягніть файл у цю область, щоб завантажити</p>
                    <p className="ant-upload-hint">Вибрати шаблон</p>
                </>
            )}
            {!isPreview && isImage && (
                <p className="ant-upload-drag-icon">
                    <p className="ant-upload-text">Натисніть або перетягніть картинку у цю область, щоб завантажити</p>
                    <Icon.InboxOutlined />
                </p>
            )}
            {isPreview && isImage && <Image src={file ? URL.createObjectURL(file) : uri} alt="image" preview={false} />}
        </Dragger>
    );
}
