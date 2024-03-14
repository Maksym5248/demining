import { useEffect, useState } from 'react';

import { Form, Drawer, Divider, Spin, message} from 'antd';
import { observer } from 'mobx-react-lite'

import { useStore, useWizard } from '~/hooks'
import { dates } from '~/utils';
import { EQUIPMENT_TYPE, MAP_ZOOM, WIZARD_MODE, TRANSPORT_TYPE, MODALS, MAP_VIEW_TAKE_PRINT_CONTAINER, MAP_SIZE } from '~/constants';
import { Select, WizardButtons, WizardFooter } from '~/components';
import { Modal, Image, Crashlytics, Template } from '~/services';
import { fileUtils } from '~/utils/file';

import { IMissionReportForm } from './mission-report-wizard.types';
import { s } from './mission-report-wizard.styles';
import  { 
	ExplosiveObjectAction,
	Timer,
	Transport, 
	Equipment,
	Approved, 
	Documents ,
	Act,
	Territory,
	Employees,
	Map
} from "./components";

interface Props {
  id?: string;
  isVisible: boolean;
  hide: () => void;
  mode: WIZARD_MODE
}

export const MissionReportWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
	const [isLoadingPreview, setLoadingPreview] = useState(false);
	const [templateId, setTemplateId] = useState();

	const { explosiveObject, order, missionRequest, transport, equipment, employee, missionReport, document } = useStore();

	const wizard = useWizard({id, mode});

	const currentMissionReport = id ? missionReport.collection.get(id) : null;

	const onOpenDocxPreview = async () => {
		try {
			setLoadingPreview(true);

			if(!currentMissionReport) throw new Error("there is no mission report");
			if(!templateId) throw new Error("there is no selected template");

			const image = await Image.takeMapImage(`#${MAP_VIEW_TAKE_PRINT_CONTAINER}`);

			const imageData = {
				_type: "image",
				source: fileUtils.b64toBlob(image),
				format: 'image/jpeg',
				altText: "image",
				width: MAP_SIZE.MEDIUM_WIDTH,
				height: MAP_SIZE.MEDIUM_HEIGHT,
			};
		
			const data = {
				...currentMissionReport.data,
				image: imageData
			}

			const currentDocument = document.collection.get(templateId);

			if(!currentDocument) throw new Error("there is no selected document");

			const template = await currentDocument.load.run();
			
			const value = await Template.generateFile(template, data);

			const name = `${currentMissionReport.executedAt.format("YYYY.MM.DD")} ${data.actNumber}`

			const file = fileUtils.blobToFile(value, {
				name,
				type: "docx"
			});

			Modal.show(MODALS.DOCX_PREVIEW, { file, name })
		} catch (e) {
			Crashlytics.error("MissionReportWizardModal - onOpenDocxPreview: ", e)
			message.error('Bиникла помилка');
		} finally {
			setLoadingPreview(false);
		}
	};

	const onFinishCreate = async (values: IMissionReportForm) => {
		await missionReport.create.run(values);
		hide();
	};
	
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onFinishUpdate = async (values: IMissionReportForm) => {
		await missionReport.update.run(id, values);
		hide();
	};

	useEffect(() => {
		if(id){
			missionReport.fetchItem.run(id)
		}
		explosiveObject.fetchList.run();
		order.fetchList.run();
		missionRequest.fetchList.run();
		transport.fetchList.run();
		equipment.fetchList.run();
		employee.fetchList.run();
		document.fetchTemplatesList.run();
	}, []);

	const isLoading = isLoadingPreview
	 || missionReport.fetchItem.inProgress
	 || explosiveObject.fetchList.inProgress
	 || order.fetchList.inProgress
	 || missionRequest.fetchList.inProgress
	 || transport.fetchList.inProgress
	 || equipment.fetchList.inProgress
	 || employee.fetchList.inProgress
	 || !explosiveObject.fetchList.isLoaded
	 || !order.fetchList.isLoaded
	 || !missionRequest.fetchList.isLoaded
	 || !transport.fetchList.isLoaded
	 || !equipment.fetchList.isLoaded
	 || !employee.fetchList.isLoaded;

	 const transportExplosiveObject = currentMissionReport?.transportActions?.find(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS);
	 const transportHumans = currentMissionReport?.transportActions?.find(el => el.type === TRANSPORT_TYPE.FOR_HUMANS);
	 const mineDetector = currentMissionReport?.equipmentActions?.find(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR);

	 const initialValues: Partial<IMissionReportForm> = (wizard.isEdit || wizard.isView) ? {
		approvedAt: currentMissionReport?.approvedAt,
		approvedById: currentMissionReport?.approvedByAction?.employeeId,
		number: currentMissionReport?.number,
		subNumber: currentMissionReport?.subNumber,
		executedAt: currentMissionReport?.executedAt,
		orderId: currentMissionReport?.order?.id,
		missionRequestId: currentMissionReport?.missionRequest?.id,
		checkedTerritory: currentMissionReport?.checkedTerritory,
		depthExamination: currentMissionReport?.depthExamination,
		uncheckedTerritory: currentMissionReport?.uncheckedTerritory,
		uncheckedReason: currentMissionReport?.uncheckedReason,
		workStart: currentMissionReport?.workStart,
		exclusionStart: currentMissionReport?.exclusionStart,
		transportingStart: currentMissionReport?.transportingStart,
		destroyedStart: currentMissionReport?.destroyedStart,
		workEnd: currentMissionReport?.workEnd,
		transportExplosiveObjectId: transportExplosiveObject?.transportId,
		transportHumansId: transportHumans?.transportId,
		mineDetectorId: mineDetector?.equipmentId,
		explosiveObjectActions: currentMissionReport?.explosiveObjectActions.slice() ?? [],
		squadLeaderId: currentMissionReport?.squadLeaderAction?.employeeId,
		squadIds: currentMissionReport?.squadActions.map(el => el.employeeId) ?? [],
		address: currentMissionReport?.address,
		mapView: {
			markerLat: currentMissionReport?.mapView?.markerLat,
			markerLng: currentMissionReport?.mapView?.markerLng,
			circleCenterLat: currentMissionReport?.mapView?.circleCenterLat,
			circleCenterLng: currentMissionReport?.mapView?.circleCenterLng,
			circleRadius: currentMissionReport?.mapView?.circleRadius,
			zoom: currentMissionReport?.mapView?.zoom
		},
	} : {
		approvedAt: dates.today(),
		approvedById: employee.employeesChiefFirst?.id,
		number: missionReport.list.first?.subNumber ? missionReport.list.first?.number : ((missionReport.list.first?.number ?? 0) + 1),
		subNumber:  missionReport.list.first?.subNumber ? (missionReport.list.first?.subNumber ?? 0) + 1 : undefined,
		executedAt: dates.today(),
		orderId: order.list.first?.id,
		missionRequestId: missionRequest.list.first?.id,
		checkedTerritory: undefined,
		depthExamination: undefined,
		uncheckedTerritory: undefined,
		uncheckedReason: undefined,
		workStart: undefined,
		exclusionStart: undefined,
		transportingStart: undefined,
		destroyedStart: undefined,
		workEnd: undefined,
		transportExplosiveObjectId:  transport.transportExplosiveObjectFirst?.id,
		transportHumansId: transport.transportHumansFirst?.id,
		mineDetectorId: equipment.firstMineDetector?.id,
		explosiveObjectActions:[],
		squadLeaderId: employee.employeesSquadLeadFirst?.id,
		squadIds: [],
		address: "",
		mapView: {
			zoom: currentMissionReport?.mapView?.zoom || MAP_ZOOM.DEFAULT
		},
	}

	const onRemove = () => {
		missionReport.remove.run(id);
		hide();
	};

	const onAddTemplate = () => {
		Modal.show(MODALS.TEMPLATE_WIZARD, { mode: WIZARD_MODE.CREATE })
	};

	return (
		<Drawer
			open={isVisible}
			destroyOnClose
			title={`${wizard.isView ? "Переглянути": "Створити"} акт виконаних робіт`}
			placement="right"
			width={700}
			onClose={hide}
			extra={
				<WizardButtons
					onRemove={onRemove}
					onSave={onOpenDocxPreview}
					{...wizard}
					isSave={wizard.isSave && !!templateId}
				>
					{!wizard.isCreate && (
						<Select
							onAdd={onAddTemplate}
							value={templateId}
							onChange={setTemplateId}
							placeholder="Виберіть шаблон"
							options={document.missionReportTemplatesList.map((el) => ({ label: el.name, value: el.id }))}
						/>
					)}
				</WizardButtons>
			}
		>
			{isLoading
				? (<Spin css={s.spin} />)
				: (
					<Form
						name="mission-report-form"
						onFinish={wizard.isEdit ? onFinishUpdate : onFinishCreate}
						labelCol={{ span: 8 }}
						wrapperCol={{ span: 16 }}
						initialValues={initialValues}
						disabled={wizard.isView}
					>
						{ [
							<Map key="Map" mode={mode} />,
							<Territory key="Territory"/>,
							<Approved key="Approved" data={employee.employeesListChief} selectedEmployee={currentMissionReport?.approvedByAction}/>,
							<Act key="Act" />,
							<Documents
								key="Documents"
								missionRequestData={missionRequest.list.asArray}
								orderData={order.list.asArray}
							/>,
							<Timer key="Timer" />,
							<ExplosiveObjectAction key="ExplosiveObjectAction" />,
							<Transport 
								key="Transport" 
								dataHumans={transport.transportHumansList}
							 	dataExplosiveObject={transport.transportExplosiveObjectList}
								selectedTransportHumanAction={transportHumans}
								selectedTransportExplosiveAction={transportExplosiveObject}
							 />,
							<Equipment
								key="Equipment" 
								data={equipment.list.asArray}
								selectedMineDetector={mineDetector}
							  />,
							<Employees
								key="Employees" 
								squadLeads={employee.squadLeads} 
								workers={employee.workers}
								selectedSquadLead={currentMissionReport?.squadLeaderAction}
								selectedWorkers={currentMissionReport?.squadActions}
							 />
						].map((el, i) => (
							<div  key={i}>
								{el}
								<Divider/>
							</div>
						))}
						<WizardFooter {...wizard} onCancel={hide}/>
					</Form>
				)}
		</Drawer>
	);
});