import { Form } from 'antd';

import { AssetStorage } from '~/services';

import { UploadImages } from '../upload-images';

interface Props {
    name: string;
}

export const FieldImageUris = ({ name }: Props) => {
    const customRequest = async (file: File) => AssetStorage.image.create(file);

    return (
        <Form.Item name={name} labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} style={{ marginTop: 16 }}>
            <Form.Item noStyle shouldUpdate={() => true}>
                {({ getFieldValue, setFieldValue }) => (
                    <UploadImages
                        uris={getFieldValue(name)}
                        onChange={(uris: string[]) => setFieldValue(name, uris)}
                        customRequest={customRequest}
                    />
                )}
            </Form.Item>
        </Form.Item>
    );
};
