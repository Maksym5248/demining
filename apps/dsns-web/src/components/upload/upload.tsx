import React, { useEffect, useRef, useState } from 'react';

import { Image, Upload as UploadAnt, type UploadFile } from 'antd';
import { type RcFile } from 'antd/es/upload';
import { type UploadChangeParam, type UploadFileStatus } from 'antd/es/upload/interface';
import ImgCrop from 'antd-img-crop';
import { isArray } from 'lodash';
import { MIME_TYPE } from 'shared-my';

import { Icon } from '../icon';
import { type UploadRequestOption } from '../upload-images';

/**
 * Do not use this component for loading images, use UploadImages instead
 */
interface SelectTemplateProps {
    onChange: (options: { url: string | null; size: number | null }) => void;
    accept?: string | string[];
    type?: 'document' | 'image';
    uri?: string;
    customRequest?: (file: File) => Promise<string>;
}

const { Dragger } = UploadAnt;

export function Upload({ type = 'document', uri, onChange, accept = MIME_TYPE.DOCX, customRequest }: SelectTemplateProps) {
    const isDocument = type === 'document';
    const isImage = type === 'image';
    const info = useRef({ isInitialized: false }).current;
    const [file, setFile] = useState<UploadFile | null>(uri ? { uid: uri, name: uri, status: 'done' as UploadFileStatus, url: uri } : null);

    const Container = isImage ? ImgCrop : React.Fragment;

    useEffect(() => {
        if (!info.isInitialized) {
            info.isInitialized = true;
            return;
        }
        onChange?.({ url: file?.url ?? null, size: file?.size ?? null });
    }, [file]);

    const handleChange = async (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setFile(info.file);
        } else if (info.file.status === 'done') {
            setFile({ ...info.file, url: info.file.response.url, status: info.file.status });
        } else if (info.file.status === 'error') {
            setFile({ ...info.file, status: info.file.status });
        } else if (info.file.status === 'removed') {
            setFile(null);
        }
    };

    const hundleCustomRequest = async (options: UploadRequestOption) => {
        const { file, onSuccess, onError } = options;

        try {
            const downloadURL = await customRequest?.(file as File);
            onSuccess?.({ url: downloadURL });
        } catch (error) {
            onError?.(error as Error);
        }
    };

    return (
        <Container
            aspect={1.2}
            minZoom={0.5}
            rotationSlider={isImage}
            zoomSlider={isImage}
            // @ts-ignore
            cropperProps={{ restrictPosition: false }}>
            <Dragger
                openFileDialogOnClick
                fileList={file ? [file as RcFile] : undefined}
                customRequest={hundleCustomRequest}
                maxCount={1}
                onChange={handleChange}
                accept={isArray(accept) ? accept.join(', ') : accept}>
                {isDocument && (
                    <>
                        <p className="ant-upload-drag-icon">
                            <Icon.InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Натисніть або перетягніть файл у цю область, щоб завантажити</p>
                        <p className="ant-upload-hint">Вибрати</p>
                    </>
                )}
                {!file && isImage && (
                    <p className="ant-upload-drag-icon">
                        <p className="ant-upload-text">Натисніть або перетягніть картинку у цю область, щоб завантажити</p>
                        <Icon.InboxOutlined />
                    </p>
                )}
                {file && isImage && <Image src={file?.url} alt="image" preview={false} />}
            </Dragger>
        </Container>
    );
}
