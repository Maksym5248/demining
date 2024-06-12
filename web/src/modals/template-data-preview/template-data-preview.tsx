import { Modal, Table } from 'antd';
import { observer } from 'mobx-react-lite';

import { missionReportTemplateData } from './data';
import { s } from './template-data-preview.style';
import { TemplateDataPreviewModalProps } from './template-data-preview.types';

const columns = [
    {
        title: 'Назва поля',
        dataIndex: 'field',
        key: 'field',
    },
    {
        title: 'ключ в шаблоні',
        dataIndex: 'key',
        key: 'key',
    },
    {
        title: 'Приклад значення',
        dataIndex: 'value',
        key: 'value',
    },
];

export const TemplateDataPreviewModal = observer(({ isVisible, hide }: TemplateDataPreviewModalProps) => {
    const onSave = async () => {
        hide();
    };

    const onCancel = () => {
        hide();
    };

    return (
        <Modal
            centered
            afterClose={hide}
            title="Поля для створення шаблону"
            open={isVisible}
            width={1000}
            onOk={onSave}
            onCancel={onCancel}>
            <div css={s.modal}>
                <Table dataSource={missionReportTemplateData} columns={columns} pagination={false} />;
            </div>
        </Modal>
    );
});
