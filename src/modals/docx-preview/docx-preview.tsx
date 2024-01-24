import { useCallback, useEffect, useState } from 'react';

import { Button, Modal } from 'antd';
import { observer } from 'mobx-react-lite'

import { useAsyncEffect, useStore } from '~/hooks'
import { Template, FileSystem, Logger } from '~/services';
import {  Icon, UploadFile, DocxPreview } from '~/components';
import { DOCX_TEMPLATE, MIME_TYPE } from '~/constants';
import { fileUtils } from '~/utils/file';

import { DocxPreviewModalProps } from './docx-preview.types';
import { s } from './docx-preview.style';


const useTemplateFile = (template: DOCX_TEMPLATE) => {
	const [isLoading, setLoading] = useState(false);
	const [file, setFile] = useState<File | null>(null);

	const remove = async () => {
		try {
			setLoading(true);
			await FileSystem.removeTemplate(template);
			setFile(null);
		} catch (error) {
			Logger.error("SelectTemplate - onRemove: ", error)
		} finally {
			setLoading(false);
		}
	}

	const save = async (value: { file: File }) => {
		try {
			setLoading(true);
			await FileSystem.saveTemplate(template, value.file);
			setFile(value.file)
		} catch (error) {
			setFile(null);
			Logger.error("SelectTemplate - customRequest: ", error)
		} finally {
			setLoading(false);
		}
	}

	useAsyncEffect(async () => {
		try {
			setLoading(true);
			const value = await FileSystem.readTemplate(template);
			if(value){
				setFile(file as File);
			}
		} catch (e) {
			Logger.error("SelectTemplate - readTemplate: ", e)
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		file,
		remove,
		save,
		isLoading
	}
}

const useGeneratedFile = (template: File | null, data: {[key:string]: string | number }) => {
	const [isLoading, setLoading] = useState(false);
	const [file, setFile] = useState<File | null>(null); 

	const remove = async () => {
		setFile(null);
	}

	const load = useCallback(async () => {
		if(!template){
			return 
		}

		try {
			setLoading(true);
			const value = await Template.generateFile(template, data)
			setFile(fileUtils.blobToFile(value, {
				name: "generated-file",
				type: "docx"
			}))
		} catch (e) {
			Logger.error("useGeneratedFile - load: ", e)
		} finally {
			setLoading(false);
		}
	}, [template])

	useEffect(() => {
		load()
	}, [template]);

	return {
		file,
		remove,
		load,
		isLoading
	}
}

export const DocxPreviewModal  = observer(({ id, isVisible, hide }: DocxPreviewModalProps) => {
	const store = useStore();

	const missionReport = store.missionReport.collection.get(id as string);

	const data = {
		approvedAtDay: missionReport.approvedAt.format("dd")
	};

	const template = useTemplateFile(DOCX_TEMPLATE.MISSION_REPORT)
	const generated = useGeneratedFile(template.file, data)

	const onOk = () => {
		hide();
	};

	const onCancel = () => () => {
		hide();
	};

	const onSave = async () => {
		try {
			if(!generated.file){
				return 
			}
			const blob = await fileUtils.fileToBlob(generated.file, MIME_TYPE.DOCX);
			await FileSystem.saveAsUser(blob)
		} catch (e) {
			Logger.error("DocxPreviewModal - onSave :", e)
		}
	}
		
	return (   
		<Modal 
			centered
			afterClose={hide}
			width={800} 
			title="Перегляд"
			open={isVisible}
			onOk={onOk}
			onCancel={onCancel}
		>
			<div css={s.header}>
				<UploadFile
				  file={template.file}
				  onRemove={() => template.remove()}
				  customRequest={(value) => { template.save(value) }}
				/>
				{!!generated.file && (
					<Button icon={<Icon.PrinterOutlined/>} onClick={onSave}/>
				)}
			</div>
			{!!template.file && (
				<DocxPreview file={generated.file}/>
			)}
		</Modal>
	);
});

