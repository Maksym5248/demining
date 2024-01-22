import { useEffect } from 'react';

import { Button, Form, Space, Drawer, Divider, Spin} from 'antd';
import { observer } from 'mobx-react-lite'

import { useStore } from '~/hooks'
import { dates } from '~/utils';
import { EQUIPMENT_TYPE, MAP_ZOOM, TRANSPORT_TYPE } from '~/constants';

import { IMissionReportForm } from './mission-report-create.types';
import { s } from './mission-report-create.styles';
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
  hide: () => void
}

/**
 * 1 - для вибухових речовин, значення при ініціалізації повинно показати список всіх внп які не бул знищені
 * 2 - номер акту маю бути за порядком + 1;
 * 3 - транспорт
 */

export const MissionReportCreateModal = observer(({ id, isVisible, hide }: Props) => {
	const { explosiveObject, order, missionRequest, transport, equipment, employee, missionReport } = useStore();

	const isEdit = !!id;
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
		order.fetchList.run();
		missionRequest.fetchList.run();
		transport.fetchList.run();
		equipment.fetchList.run();
		employee.fetchList.run();
	}, [])

	const isLoading = explosiveObject.fetchList.inProgress
	 || order.fetchList.inProgress
	 || missionRequest.fetchList.inProgress
	 || transport.fetchList.inProgress
	 || equipment.fetchList.inProgress
	 || employee.fetchList.inProgress;

	 const initialValues:IMissionReportForm = {
		approvedAt: currentMissionReport?.approvedAt ?? dates.today(),
		approvedById: currentMissionReport?.approvedByAction?.employeeId ??employee.employeesChiefFirst?.id,
		number: currentMissionReport?.number ?? (missionReport.list.last?.number ?? 0) + 1,
		subNumber: currentMissionReport?.subNumber ?? missionReport.list.last?.subNumber ? (missionReport.list.last?.subNumber ?? 0) + 1 : undefined,
		executedAt: currentMissionReport?.executedAt ?? dates.today(),
		orderId: currentMissionReport?.order?.id ?? order.list.first?.id,
		missionRequestId: currentMissionReport?.missionRequest?.id ?? missionRequest.list.first?.id,
		checkedTerritory: currentMissionReport?.checkedTerritory,
		depthExamination: currentMissionReport?.depthExamination,
		uncheckedTerritory: currentMissionReport?.uncheckedTerritory,
		uncheckedReason: currentMissionReport?.uncheckedReason,
		workStart: currentMissionReport?.workStart ?? dates.today().hour(9).minute(0),
		exclusionStart: currentMissionReport?.exclusionStart,
		transportingStart: currentMissionReport?.transportingStart,
		destroyedStart: currentMissionReport?.destroyedStart,
		workEnd: currentMissionReport?.workEnd,
		transportExplosiveObjectId: (currentMissionReport?.transportActions?.find(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS))?.transportId ?? transport.transportExplosiveObjectFirst?.id,
		transportHumansId: (currentMissionReport?.transportActions?.find(el => el.type === TRANSPORT_TYPE.FOR_HUMANS))?.transportId ?? transport.transportHumansFirst?.id,
		mineDetectorId: (currentMissionReport?.equipmentActions?.find(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR))?.equipmentId ?? equipment.firstMineDetector?.id,
		explosiveObjectActions: currentMissionReport?.explosiveObjectActions.slice() ?? [],
		squadLeadId: currentMissionReport?.squadLeaderAction.employeeId ?? employee.employeesSquadLeadFirst?.id,
		workersIds: currentMissionReport?.squadActions.map(el => el.employeeId) ?? [],
		address: currentMissionReport?.address ?? "",
		mapView: {
			markerLat: currentMissionReport?.mapView?.markerLat,
			markerLng: currentMissionReport?.mapView?.markerLng,
			circleCenterLat: currentMissionReport?.mapView?.circleCenterLat,
			circleCenterLng: currentMissionReport?.mapView?.circleCenterLng,
			circleRadius: currentMissionReport?.mapView?.circleRadius,
			zoom: currentMissionReport?.mapView?.zoom || MAP_ZOOM.DEFAULT
		},
	}

	return (
		<Drawer
			open={isVisible}
			destroyOnClose
			title={`${isEdit ? "Редагувати": "Створити"} акт виконаних робіт`}
			placement="right"
			width={700}
			onClose={hide}
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
							<Map key="Map"/>,
							<Territory key="Territory"/>
						].map(el => (
							<>
								{el}
								<Divider/>
							</>
						))}
						<Form.Item label=" " colon={false}>
							<Space>
								<Button onClick={hide}>Скасувати</Button>
								<Button htmlType="submit" type="primary">
									{isEdit ? "Зберегти" : "Додати"}
								</Button>
							</Space>
						</Form.Item>
					</Form>
				)}
		</Drawer>
	);
});