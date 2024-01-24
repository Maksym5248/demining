import { Button, Modal } from 'antd';
import { observer } from 'mobx-react-lite'

import { useStore } from '~/hooks'
import { Template, FileSystem } from '~/services';
import {  Icon, SelectTemplate  } from '~/components';

import { DocxPreviewModalProps } from './docx-preview.types';

// https://www.npmjs.com/package/docx-preview
export const DocxPreviewModal  = observer(({ id, isVisible, hide }: DocxPreviewModalProps) => {
	const store = useStore();

	const missionReport = store.missionReport.collection.get(id as string);

	const onOk = () => {
		hide();
	};

	const onCancel = () => () => {
		hide();
	};

	const onOpenGenerateDoc = async () => {
		const template = await FileSystem.readTemplate();
		const file = await Template.generateFile(template, {
			approvedAtDay: missionReport.approvedAt.format("dd")
		})
		FileSystem.saveAsUser(file)
	}
	
	return (   
		<Modal 
			centered 
			width={800} 
			title="Basic Modal"
			open={isVisible}
			onOk={onOk}
			onCancel={onCancel}
		>
			<SelectTemplate />
			<Button icon={<Icon.PrinterOutlined/>} onClick={onOpenGenerateDoc}/>
			<div />
		</Modal>
	);
});

