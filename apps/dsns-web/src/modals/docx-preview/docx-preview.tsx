import { MIME_TYPE } from '@/shared/db';
import { fileUtils } from '@/shared-client/common';
import { Modal } from 'antd';
import { observer } from 'mobx-react-lite';

import { DocxPreview } from '~/components';
import { Crashlytics } from '~/services';

import { s } from './docx-preview.style';
import { type DocxPreviewModalProps } from './docx-preview.types';

export const DocxPreviewModal = observer(({ file, name, isVisible, hide }: DocxPreviewModalProps) => {
    const onSave = async () => {
        hide();

        try {
            if (!file) {
                return;
            }
            const blob = await fileUtils.fileToBlob(file, MIME_TYPE.DOCX);
            await fileUtils.saveAsUser(blob, name);
        } catch (e) {
            Crashlytics.error('DocxPreviewModal - onSave :', e);
        }
    };

    const onCancel = () => {
        hide();
    };

    return (
        <Modal centered afterClose={hide} title="Перегляд" open={isVisible} width={1000} onOk={onSave} onCancel={onCancel}>
            <div css={s.modal}>{!!file && <DocxPreview file={file} />}</div>
        </Modal>
    );
});
