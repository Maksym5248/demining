import { Modal } from 'antd';
import { observer } from 'mobx-react-lite'

import { Crashlytics } from '~/services';
import { DocxPreview } from '~/components';
import { MIME_TYPE } from '~/constants';
import { fileUtils } from '~/utils/file';

import { DocxPreviewModalProps } from './docx-preview.types';
import { s } from './docx-preview.style';

export const DocxPreviewModal  = observer(({ file, name, isVisible, hide }: DocxPreviewModalProps) => {
	const onSave = async () => {
		hide();

		try {
			if(!file){
				return 
			}
			const blob = await fileUtils.fileToBlob(file, MIME_TYPE.DOCX);
			await fileUtils.saveAsUser(blob, name)
		} catch (e) {
			Crashlytics.error("DocxPreviewModal - onSave :", e)
		}
	};

	const onCancel = () => {
		hide();
	};
		
	return (   
		<Modal 
			centered
			afterClose={hide}
			title="Перегляд"
			open={isVisible}
			width={1000}
			onOk={onSave}
			onCancel={onCancel}
		>
			<div css={s.modal}>
				{!!file && (
					<DocxPreview file={file}/>
				)}
			</div>
		</Modal>
	);
});

