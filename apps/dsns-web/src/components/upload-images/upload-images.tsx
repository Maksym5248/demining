import { useEffect, useRef, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Upload, Image, message, type UploadFile } from 'antd';
import { type UploadChangeParam, type UploadFileStatus } from 'antd/es/upload/interface';
import ImgCrop from 'antd-img-crop';
import { type BeforeUploadFileType, type RcFile, type UploadProgressEvent, type UploadRequestError } from 'rc-upload/lib/interface';

interface UploadImagesProps {
    uris?: string[];
    previewImage?: boolean;
    onChange?: (uris: string[]) => void;
    customRequest?: (file: File) => Promise<string>;
    max?: number;
}

export interface UploadRequestOption {
    onProgress?: (event: UploadProgressEvent) => void;
    onError?: (event: UploadRequestError | ProgressEvent) => void;
    onSuccess?: (body: any, xhr?: XMLHttpRequest) => void;
    data?: Record<string, unknown>;
    filename?: string;
    file: Exclude<BeforeUploadFileType, File | boolean> | RcFile;
    withCredentials?: boolean;
    action: string;
}

const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

export const UploadImages = ({ uris, onChange, customRequest, max = 8 }: UploadImagesProps) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>(
        uris?.map(uri => ({ uid: uri, name: uri, status: 'done' as UploadFileStatus, url: uri })) || [],
    );
    const info = useRef({ isInitialized: false }).current;

    useEffect(() => {
        if (!info.isInitialized) {
            info.isInitialized = true;
            return;
        }
        onChange?.(fileList.map(file => file.url as string).filter(Boolean));
    }, [fileList]);

    const beforeUpload = (file: { type: string }) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
        }
        return isImage || Upload.LIST_IGNORE; // Prevent non-image files from being added to the list
    };

    const handleChange = async (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setFileList(info.fileList);
        } else if (info.file.status === 'done') {
            setFileList(prev => prev.map(file => (file.uid === info.file.uid ? { ...file, status: info.file.status } : file)));
        } else if (info.file.status === 'error') {
            setFileList(prev => prev.map(file => (file.uid === info.file.uid ? { ...file, status: info.file.status } : file)));
        } else if (info.file.status === 'removed') {
            setFileList(prev => prev.filter(file => file.uid !== info.file.uid));
        }
    };

    const hundleCustomRequest = async (options: UploadRequestOption) => {
        const { file, onSuccess, onError } = options;

        try {
            const downloadURL = await customRequest?.(file as File);
            onSuccess?.(downloadURL);
            setFileList(prev => prev.map(file => (file.uid === file.uid ? { ...file, url: downloadURL } : file)));
        } catch (error) {
            onError?.(error as Error);
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as File);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    return (
        <>
            <ImgCrop aspect={1.2}>
                <Upload
                    accept="image/*"
                    fileList={fileList}
                    beforeUpload={beforeUpload}
                    customRequest={hundleCustomRequest}
                    onPreview={handlePreview}
                    listType="picture-card"
                    onChange={handleChange}>
                    {fileList.length >= max ? null : uploadButton}
                </Upload>
            </ImgCrop>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: visible => setPreviewOpen(visible),
                        afterOpenChange: visible => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};
