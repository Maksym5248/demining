import { Form, Input } from 'antd';

import { AssetStorage } from '~/services';

import { UploadImages } from '../upload-images';

interface Props {
    label: string;
    name: string;
    nameDesc: string;
}

export const FieldSection = ({ label, name, nameDesc }: Props) => {
    const customRequest = async (file: File) => AssetStorage.image.create(file);

    return (
        <>
            <Form.Item label={label} name={name}>
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
            <Form.Item name={nameDesc} wrapperCol={{ offset: 8, span: 16 }}>
                <Input.TextArea placeholder="Введіть дані" maxLength={300} rows={4} />
            </Form.Item>
        </>
    );
};
