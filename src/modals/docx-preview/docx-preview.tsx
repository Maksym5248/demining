import { useCallback, useEffect, useState } from 'react';

import { Modal, message } from 'antd';
import { observer } from 'mobx-react-lite'
import { toLower } from 'lodash';
import { Dayjs } from 'dayjs';

import { useAsyncEffect, useStore } from '~/hooks'
import { Template, FileSystem, Logger } from '~/services';
import { UploadFile, DocxPreview } from '~/components';
import { DOCX_TEMPLATE, MIME_TYPE } from '~/constants';
import { fileUtils } from '~/utils/file';
import { dates, str } from '~/utils';

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
			message.error("Не видалити шаблон")
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
			message.error("Не вдалось зберегти шаблон")
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
				setFile(value);
			}
		} catch (e) {
			message.error("Не вдалось завантажити шаблон")
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
			message.error("Не вдалось згенеруати файл")
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


const getDate = (date: Dayjs) => `«${date.format("DD")}» ${toLower(dates.formatGenitiveMonth(date))} ${date.format("YYYY")} року`;

export const DocxPreviewModal  = observer(({ id, isVisible, hide }: DocxPreviewModalProps) => {
	const store = useStore();

	const {
		approvedAt,
		approvedByAction,
		number,
		subNumber,
		executedAt,
		order,
		missionRequest,
		address,
		mapView,
		checkedTerritory,
		uncheckedTerritory,
		depthExamination,
		uncheckedReason,
	} = store.missionReport.collection.get(id as string);

	const data = {
		approvedAt: getDate(approvedAt),
		approvedByName: `${str.toUpperFirst(approvedByAction.firstName)} ${str.toUpper(approvedByAction.lastName)}`,
		approvedByRank: approvedByAction.rank.fullName,
		approvedByPosition: approvedByAction.position,
		actNumber: `${number}${subNumber ? `/${subNumber}` : ""}`,
		executedAt: getDate(executedAt),
		orderSignedAt: getDate(order.signedAt),
		orderNumber: order.number,
		missionRequestAt:  getDate(missionRequest.signedAt),
		missionNumber: missionRequest.number,
		address,
		lat: mapView.markerLat,
		lng: mapView.markerLng,
		checkedM2: checkedTerritory ?? "---",
		checkedGA: checkedTerritory ? checkedTerritory / 10000 : "---",
		uncheckedM2: uncheckedTerritory ?? "---",
		uncheckedGA: uncheckedTerritory ? uncheckedTerritory / 10000 : "---",
		depthM2: depthExamination ?? "---",
		uncheckedReason: uncheckedReason ?? "---",
	}

	const template = useTemplateFile(DOCX_TEMPLATE.MISSION_REPORT)
	const generated = useGeneratedFile(template.file, data)

	const onOk = async () => {
		hide();

		try {
			if(!generated.file){
				return 
			}
			const blob = await fileUtils.fileToBlob(generated.file, MIME_TYPE.DOCX);
			await FileSystem.saveAsUser(blob)
		} catch (e) {
			Logger.error("DocxPreviewModal - onSave :", e)
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
			onOk={onOk}
			onCancel={onCancel}
		>
			<div css={s.modal}>
				<div css={s.header}>
					<UploadFile
						file={template.file}
						onRemove={() => template.remove()}
						customRequest={(value) => { template.save(value) }}
					/>
				</div>
				{!!template.file && (
					<DocxPreview file={generated.file}/>
				)}
			</div>
		</Modal>
	);
});

