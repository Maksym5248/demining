import { Button, Form, Space, Popconfirm } from 'antd';

import { Icon } from '../icon';

interface WizardFooterProps {
    onCancel?: () => void;
    onRemove?: () => void;
    isRemove?: boolean;
    isView?: boolean;
    isEdit?: boolean;
    loading?: boolean;
}

export function WizardFooter({ onCancel, onRemove, isRemove, isView, isEdit, loading }: WizardFooterProps) {
    return isView ? (
        <div />
    ) : (
        <Form.Item label=" " colon={false} labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
            <Space style={{ width: '100%', flex: 1, justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                    {!!onRemove && isRemove && (
                        <Popconfirm
                            title="Видалити"
                            description="Ви впевнені, після цього дані не можливо відновити ?"
                            onConfirm={onRemove}
                            okText="Так"
                            cancelText="Ні">
                            <Button danger style={{ marginRight: 20 }} icon={<Icon.DeleteOutlined />}>
                                Видалити
                            </Button>
                        </Popconfirm>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button onClick={onCancel}>Скасувати</Button>
                    <Button htmlType="submit" type="primary" loading={loading}>
                        {isEdit ? 'Зберегти' : 'Додати'}
                    </Button>
                </div>
            </Space>
        </Form.Item>
    );
}
