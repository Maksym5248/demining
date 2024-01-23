import { useEffect } from 'react';

import { Button, Form, Space, Drawer, Divider, Spin} from 'antd';
import { observer } from 'mobx-react-lite'

import { useStore } from '~/hooks'
import { dates } from '~/utils';
import { EQUIPMENT_TYPE, MAP_ZOOM, WIZARD_MODE, TRANSPORT_TYPE } from '~/constants';
import { DrawerExtra , SelectTemplate } from '~/components';

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
  type:  "edit" |  "view";
  hide: () => void;
  mode: WIZARD_MODE
}

/**
 * 1 - для вибухових речовин, значення при ініціалізації повинно показати список всіх внп які не бул знищені
 * 2 - номер акту маю бути за порядком + 1;
 * 3 - транспорт
 */

export const MissionReportWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
	const { explosiveObject, order, missionRequest, transport, equipment, employee, missionReport } = useStore();

	const isEdit = !!id && mode === WIZARD_MODE.EDIT;
	const isView = !!id && mode === WIZARD_MODE.VIEW;
	const isCreate = !id && mode === WIZARD_MODE.CREATE;
	const currentMissionReport = id ? missionReport.collection.get(id) : null;

	const onFinishCreate = async (values: IMissionReportForm) => {
		await missionReport.add.run(values);
		hide();
	};
	
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onFinishUpdate = async (values: IMissionReportForm) => {
		// await employee.update.run(values);
		hide();
	};

	useEffect(() => {
		explosiveObject.fetchList.run();
		explosiveObject.fetchListTypes.run();
		order.fetchList.run();
		missionRequest.fetchList.run();
		transport.fetchList.run();
		equipment.fetchList.run();
		employee.fetchList.run();
	}, []);

	const isLoading = explosiveObject.fetchList.inProgress
	 || explosiveObject.fetchListTypes.inProgress
	 || order.fetchList.inProgress
	 || missionRequest.fetchList.inProgress
	 || transport.fetchList.inProgress
	 || equipment.fetchList.inProgress
	 || employee.fetchList.inProgress
	 || !explosiveObject.fetchList.isLoaded
	 || !explosiveObject.fetchListTypes.isLoaded
	 || !order.fetchList.isLoaded
	 || !missionRequest.fetchList.isLoaded
	 || !transport.fetchList.isLoaded
	 || !equipment.fetchList.isLoaded
	 || !employee.fetchList.isLoaded;

	 const initialValues: Partial<IMissionReportForm> = (isEdit || isView) ? {
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
		transportExplosiveObjectId: (currentMissionReport?.transportActions?.find(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS))?.transportId,
		transportHumansId: (currentMissionReport?.transportActions?.find(el => el.type === TRANSPORT_TYPE.FOR_HUMANS))?.transportId,
		mineDetectorId: (currentMissionReport?.equipmentActions?.find(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR))?.equipmentId,
		explosiveObjectActions: currentMissionReport?.explosiveObjectActions.slice() ?? [],
		squadLeadId: currentMissionReport?.squadLeaderAction.employeeId,
		workersIds: currentMissionReport?.squadActions.map(el => el.employeeId) ?? [],
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
		number: (missionReport.list.last?.number ?? 0) + 1,
		subNumber:  missionReport.list.last?.subNumber ? (missionReport.list.last?.subNumber ?? 0) + 1 : undefined,
		executedAt: dates.today(),
		orderId: order.list.first?.id,
		missionRequestId: missionRequest.list.first?.id,
		checkedTerritory: undefined,
		depthExamination: undefined,
		uncheckedTerritory: undefined,
		uncheckedReason: undefined,
		workStart: dates.today().hour(9).minute(0),
		exclusionStart: undefined,
		transportingStart: undefined,
		destroyedStart: undefined,
		workEnd: undefined,
		transportExplosiveObjectId:  transport.transportExplosiveObjectFirst?.id,
		transportHumansId: transport.transportHumansFirst?.id,
		mineDetectorId: equipment.firstMineDetector?.id,
		explosiveObjectActions:[],
		squadLeadId: employee.employeesSquadLeadFirst?.id,
		workersIds: [],
		address: "",
		mapView: {
			zoom: currentMissionReport?.mapView?.zoom || MAP_ZOOM.DEFAULT
		},
	}

	const onRemove = () => () => {
		missionReport.remove.run(id);
	};

	return (
		<Drawer
			open={isVisible}
			destroyOnClose
			title={`${isView ? "Переглянути": "Створити"} акт виконаних робіт`}
			placement="right"
			width={700}
			onClose={hide}
			extra={
				<DrawerExtra
					onRemove={isCreate ? undefined: onRemove}
				>
					<SelectTemplate />
				</DrawerExtra>
			}
		>
			{ isLoading
				? (<Spin css={s.spin} />)
				: (
					<Form
						name="mission-report-form"
						onFinish={isEdit ? onFinishUpdate : onFinishCreate}
						labelCol={{ span: 8 }}
						wrapperCol={{ span: 16 }}
						initialValues={initialValues}
						disabled={isView}
					>
						{ [
							<Approved key="Approved" data={employee.employeesListChief}/>,
							<Act key="Act"/>,
							<Documents
								key="Documents"
								missionRequestData={missionRequest.list.asArray}
								orderData={order.list.asArray}
							/>,
							<Timer key="Timer" />,
							<ExplosiveObjectAction key="ExplosiveObjectAction" />,
							<Transport key="Transport" dataHumans={transport.transportHumansList} dataExplosiveObject={transport.transportExplosiveObjectList}/>,
							<Equipment key="Equipment" data={equipment.list.asArray} />,
							<Employees
								key="Employees" 
								squadLeads={employee.squadLeads} 
								workers={employee.workers}
							 />,
							<Map key="Map" mode={mode} />,
							<Territory key="Territory"/>
						].map((el, i) => (
							<div  key={i}>
								{el}
								<Divider/>
							</div>
						))}
						{!isView && (
							<Form.Item label=" " colon={false}>
								<Space>
									<Button onClick={hide}>Скасувати</Button>
									<Button htmlType="submit" type="primary">
										{isEdit ? "Зберегти" : "Додати"}
									</Button>
								</Space>
							</Form.Item>
						)}
					</Form>
				)}
		</Drawer>
	);
});