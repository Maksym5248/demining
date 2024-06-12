import { Upload } from 'antd';
import { RcFile } from 'antd/es/upload';

import { MIME_TYPE } from '~/constants';

import { Icon } from '../icon';

interface SelectTemplateProps {
    file: File | null;
    onChangeFile: (options: { file: File }) => void;
}

const { Dragger } = Upload;

export function UploadFile({ file, onChangeFile }: SelectTemplateProps) {
    return (
        <Dragger
            fileList={file ? [file as RcFile] : undefined}
            customRequest={(value) => onChangeFile && onChangeFile(value as { file: File })}
            maxCount={1}
            disabled={false}
            accept={MIME_TYPE.DOCX}>
            <p className="ant-upload-drag-icon">
                <Icon.InboxOutlined />
            </p>
            <p className="ant-upload-text">Натисніть або перетягніть файл у цю область, щоб завантажити</p>
            <p className="ant-upload-hint">Вибрати шаблон</p>
        </Dragger>
    );
}
