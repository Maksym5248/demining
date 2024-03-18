import { useEffect, useState, useMemo } from 'react';

import { Form, Drawer, Divider, Spin, message} from 'antd';
import { observer } from 'mobx-react-lite'

import { useStore, useWizard } from '~/hooks'
import { dates } from '~/utils';
import { MAP_ZOOM, WIZARD_MODE, MODALS, MAP_VIEW_TAKE_PRINT_CONTAINER, MAP_SIZE } from '~/constants';
import { Select, WizardButtons, WizardFooter } from '~/components';
import { Modal, Image, Crashlytics, Template } from '~/services';
import { fileUtils } from '~/utils/file';
import { IEmployee, IMissionReport, IOrder } from '~/stores';

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

const createEditValue = (currentMissionReport?: IMissionReport | null) => ({
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
	transportExplosiveObjectId: currentMissionReport?.transportExplosiveObject?.transportId,
	transportHumansId: currentMissionReport?.transportHumans?.transportId,
	mineDetectorId: currentMissionReport?.mineDetector?.equipmentId,
	explosiveObjectActions: currentMissionReport?.explosiveObjectActions.slice() ?? [],
	squadLeaderId: currentMissionReport?.squadLeaderAction?.employeeId,
	squadIds: currentMissionReport?.squadActions.map(el => el.employeeId) ?? [],
	address: currentMissionReport?.address,
	mapView: currentMissionReport?.mapView,
})

const createCreateValue = (
	chiefFirst?: IEmployee,
	firstMissionReport?: IMissionReport,
	firstOrder?: IOrder,
	firstMissionRequest?: IOrder,
	firstSquadLeader?: IEmployee,
) => ({
	approvedAt: dates.today(),
	approvedById: chiefFirst?.id,
	number: firstMissionReport?.subNumber ? firstMissionReport?.number : ((firstMissionReport?.number ?? 0) + 1),
	subNumber:  firstMissionReport?.subNumber ? (firstMissionReport?.subNumber ?? 0) + 1 : undefined,
	executedAt: dates.today(),
	orderId: firstOrder?.id,
	missionRequestId: firstMissionRequest?.id,
	checkedTerritory: undefined,
	depthExamination: undefined,
	uncheckedTerritory: undefined,
	uncheckedReason: undefined,
	workStart: undefined,
	exclusionStart: undefined,
	transportingStart: undefined,
	destroyedStart: undefined,
	workEnd: undefined,
	transportExplosiveObjectId: undefined,
	transportHumansId: undefined,
	mineDetectorId: undefined,
	explosiveObjectActions:[],
	squadLeaderId: firstSquadLeader?.id,
	squadIds: [],
	address: "",
	mapView: {
		zoom: MAP_ZOOM.DEFAULT
	},
})

export const MissionReportWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
	const [isLoadingPreview, setLoadingPreview] = useState(false);
	const [templateId, setTemplateId] = useState();

	const { order, missionRequest, employee, missionReport, document } = useStore();

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
		await missionReport.create.run({
			...values,
			squadIds: values.squadIds.filter(el => !!el)
		});
		hide();
	};
	
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onFinishUpdate = async (values: IMissionReportForm) => {
		await missionReport.update.run(id, {
			...values,
			squadIds: values.squadIds.filter(el => !!el)
		});
		hide();
	};

	useEffect(() => {
		if(id){
			missionReport.fetchItem.run(id)
		}

		if(wizard.isCreate){
			order.fetchList.run();
			missionRequest.fetchList.run();
		}

		employee.fetchListAll.run();
		document.fetchTemplatesList.run();
	}, []);

	const isLoading = isLoadingPreview
	 || missionReport.fetchItem.inProgress
	 || employee.fetchListAll.inProgress
	 || document.fetchTemplatesList.inProgress;

	 const initialValues: Partial<IMissionReportForm> = useMemo(() => (
		(wizard.isEdit || wizard.isView)
	    ? createEditValue(currentMissionReport)
			: createCreateValue(
				employee.chiefFirst,
				missionReport.list.first,
				order.list.first,
				missionRequest.list.first,
				employee.squadLeadFirst
	   )
	 ), [isLoading]);

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
							<Approved key="Approved" data={employee.chiefs} selectedEmployee={currentMissionReport?.approvedByAction}/>,
							<Act key="Act" />,
							<Documents key="Documents" initialValues={initialValues}/>,
							<Timer key="Timer" />,
							<ExplosiveObjectAction key="ExplosiveObjectAction" />,
							<Transport 
								key="Transport"
								initialValues={initialValues}
								selectedTransportHumanAction={currentMissionReport?.transportHumans}
								selectedTransportExplosiveAction={currentMissionReport?.transportExplosiveObject}
							 />,
							<Equipment
								key="Equipment" 
								initialValues={initialValues}
								selectedMineDetector={currentMissionReport?.mineDetector}
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