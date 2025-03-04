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
            <Form.Item name={nameDesc} wrapperCol={{ offset: 4, span: 20 }}>
                <Input.TextArea placeholder="Введіть дані" rows={4} />
            </Form.Item>
        </>
    );
};
