import { useCallback, useEffect, useMemo, useState } from 'react';

import { Modal, message } from 'antd';
import { observer } from 'mobx-react-lite'
import { toLower } from 'lodash';
import { Dayjs } from 'dayjs';

import { useAsyncEffect, useStore } from '~/hooks'
import { Template, FileSystem, Crashlytics } from '~/services';
import { UploadFile, DocxPreview } from '~/components';
import { DOCX_TEMPLATE, EQUIPMENT_TYPE, TRANSPORT_TYPE, MIME_TYPE, MAP_SIZE } from '~/constants';
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
			Crashlytics.error("SelectTemplate - onRemove: ", error)
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
			Crashlytics.error("SelectTemplate - customRequest: ", error)
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
			Crashlytics.error("SelectTemplate - readTemplate: ", e)
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

const useGeneratedFile = (template: File | null, name:string, data: {[key:string]: any }) => {
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
				name,
				type: "docx"
			}))
		} catch (e) {
			message.error("Не вдалось згенеруати файл")
			Crashlytics.error("useGeneratedFile - load: ", e)
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


const getDate = (date?: Dayjs, empty?:string) => date
	? `«${date.format("DD")}» ${toLower(dates.formatGenitiveMonth(date))} ${date.format("YYYY")} року`
	: (empty ?? "`«--» ------ року`");

const getTime = (start?:Dayjs, end?:Dayjs) => start && end
	? `з ${start?.format("HH")} год. ${start?.format("mm")} хв. по ${end?.format("HH")} год. ${end?.format("mm")} хв.`
	: "з ---- по ----";

export const DocxPreviewModal  = observer(({ id, isVisible, hide, image }: DocxPreviewModalProps) => {
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
		explosiveObjectActions,
		workStart,
		exclusionStart,
		transportingStart,
		destroyedStart,
		workEnd,
		squadActions,
		squadLeaderAction,
		transportActions,
		equipmentActions
	} = store.missionReport.collection.get(id as string);

	const imageData = useMemo(() => ({
		_type: "image",
		source: fileUtils.b64toBlob(image),
		format: 'image/jpeg',
		altText: "image",
		width: MAP_SIZE.MEDIUM_WIDTH,
		height: MAP_SIZE.MEDIUM_HEIGHT,
	}), [image]);

	const actNumber = `${number}${subNumber ? `/${subNumber}` : ""}`;

	const data = {
		approvedAt: getDate(approvedAt),
		approvedByName: `${str.toUpperFirst(approvedByAction.firstName)} ${str.toUpper(approvedByAction.lastName)}`,
		approvedByRank: approvedByAction.rank.fullName,
		approvedByPosition: approvedByAction.position,
		actNumber,
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
		explosiveObjectsTotal: explosiveObjectActions.reduce((acc, el) => el.quantity + acc, 0),
		explosiveObjects: explosiveObjectActions.reduce((acc, el, i) => {
			const lasSign = explosiveObjectActions.length - 1 === i ? ".": ", ";
			return `${acc}${el.fullDisplayName} – ${el.quantity} од., ${el.category} категорії${lasSign}`;
		},  ""),
		exclusionTime: getTime(exclusionStart, transportingStart ?? destroyedStart ?? workEnd),
		exclusionDate: getDate(exclusionStart, ""),
		transportingTime: getTime(transportingStart, destroyedStart ?? workEnd),
		transportingDate: getDate(transportingStart, ""),
		explosiveObjectsTotalTransport: explosiveObjectActions.reduce((acc, el) => (el.isTransported ? el.quantity: 0) + acc, 0),
		squadTotal: squadActions.length + 1,
		humanHours: (squadActions.length + 1) * (workEnd.hour() - workStart.hour()),
		transportHuman: transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_HUMANS)?.fullName ?? "--",
		transportExplosiveObjects: transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS)?.fullName ?? "--",
		mineDetector: equipmentActions.find(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR)?.name ?? "--",
		squadLead: squadLeaderAction.signName,
		squadPosition: squadActions.reduce((prev, el, i) => `${prev}${el.position}${squadActions.length - 1 !== i ? `\n`: ""}`, ""),
		squadName: squadActions.reduce((prev, el, i) => `${prev}${el.signName}${squadActions.length - 1 !== i ? `\n`: ""}`, ""),
		image: imageData
	}

	const fileName = `${executedAt.format("YYYY.MM.DD")} ${actNumber}`
	
	const template = useTemplateFile(DOCX_TEMPLATE.MISSION_REPORT)
	const generated = useGeneratedFile(template.file, fileName, data)

	const onOk = async () => {
		hide();

		try {
			if(!generated.file){
				return 
			}
			const blob = await fileUtils.fileToBlob(generated.file, MIME_TYPE.DOCX);
			await FileSystem.saveAsUser(blob, fileName)
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

