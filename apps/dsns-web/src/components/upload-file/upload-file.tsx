import { Image, Upload } from 'antd';
import { type RcFile } from 'antd/es/upload';
import { MIME_TYPE } from 'shared-my/db';

import { Icon } from '../icon';

interface SelectTemplateProps {
    file: File | null;
    onChangeFile: (options: { file: File | null }) => void;
    accept?: string;
    preview?: 'doncument' | 'image';
    uri?: string;
}

const { Dragger } = Upload;

export function UploadFile({ preview = 'doncument', uri, file, onChangeFile, accept = MIME_TYPE.DOCX }: SelectTemplateProps) {
    return (
        <Dragger
            openFileDialogOnClick
            fileList={file ? [file as RcFile] : undefined}
            customRequest={(value) => onChangeFile && onChangeFile(value as { file: File })}
            onRemove={() => onChangeFile({ file: null })}
            maxCount={1}
            accept={accept}>
            {preview === 'doncument' && (
                <>
                    <p className="ant-upload-drag-icon">
                        <Icon.InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Натисніть або перетягніть файл у цю область, щоб завантажити</p>
                    <p className="ant-upload-hint">Вибрати шаблон</p>
                </>
            )}
            {preview === 'image' && !file && (
                <p className="ant-upload-drag-icon">
                    <Icon.InboxOutlined />
                </p>
            )}
            {preview === 'image' && !!(file || uri) && <Image src={file ? URL.createObjectURL(file) : uri} alt="image" preview={false} />}
        </Dragger>
    );
}
