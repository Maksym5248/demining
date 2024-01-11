import { useEffect } from 'react';

import { Button, Form, Space, Drawer, Divider, Spin} from 'antd';
import { observer } from 'mobx-react-lite'

import { useStore } from '~/hooks'
import { dates } from '~/utils';

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
	Employees
} from "./components";

interface Props {
  id?: string;
  isVisible: boolean;
  hide: () => void
}

/**
 * 1 - для вибухових речовин, значення при ініціалізації повинно показати список всіх внп які не бул знищені
 * 2 - номер акту маю бути за порядком + 1;
 * 3 - 
 * 
 * 
 *  1 - транспорт
 */

export const MissionReportCreateModal = observer(({ id, isVisible, hide }: Props) => {
	const { explosiveObject, order, missionRequest, transport, equipment, employee } = useStore();

	const isEdit = !!id;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onFinishCreate = async (values: IMissionReportForm) => {
		// await employee.add.run(values);
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

	 const initialValues = {
		approvedAt: dates.today(),
		approvedById: employee.employeesChiefFirst?.id,
		number: 1,
		executedAt: dates.today(),
		orderId: order.list.first?.id,
		missionRequestId: missionRequest.list.first?.id,
		transportExplosiveObjectId: transport.transportExplosiveObjectFirst?.id,
		transportHumansId: transport.transportHumansFirst?.id,
		explosiveObjectActions: [],
		squadLeadId: employee.employeesSquadLeadFirst?.id,
		workersIds: []
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
							<Approved key="1" data={employee.employeesListChief}/>,
							<Act key="2"/>,
							<Documents
								key="3"
								missionRequestData={missionRequest.list.asArray}
								orderData={order.list.asArray}
							/>,
							<Territory key="4"/>,
							<Timer key="5" />,
							<ExplosiveObjectAction key="6" />,
							<Transport key="7" dataHumans={transport.transportHumansList} dataExplosiveObject={transport.transportExplosiveObjectList}/>,
							<Equipment key="8" data={equipment.list.asArray} />,
							<Employees
							 key="8" 
							 squadLeads={employee.squadLeads} 
							 workers={employee.workers}
							 />,
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