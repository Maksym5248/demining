import { useCallback } from 'react';

import { CloseOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form} from 'antd';

import { Select } from '~/components'
import { MODALS, WIZARD_MODE } from '~/constants';
import { Modal } from '~/services';
import { IEmployee, IEmployeeAction } from '~/stores';
import { select } from '~/utils';

interface IEmployeesProps {
	squadLeads:IEmployee[];
	workers:IEmployee[];
	selectedSquadLead?:IEmployeeAction;
	selectedWorkers?:IEmployeeAction[];
}

export function Employees({ squadLeads, workers, selectedSquadLead, selectedWorkers }: IEmployeesProps ) {
	const onAdd = useCallback( () => {
		Modal.show(MODALS.EMPLOYEES_WIZARD,  { mode: WIZARD_MODE.CREATE})
	}, []);
	
	return <>
		<Form.Item
			label="Керівник розрахунку"
			name="squadLeaderId"
			rules={[{ required: true, message: 'Обов\'язкове поле' }]}
		>
			<Form.Item
				noStyle
				shouldUpdate={() => true}
			>
				{({ getFieldValue }) => {
					const squadIds = getFieldValue("squadIds");

					return (
						<Select
							options={select.append(
								squadLeads.filter(el => !squadIds.includes(el.id))
									.map((el) => ({ label: el.fullName, value: el.id })),
								{ label: selectedSquadLead?.fullName, value: selectedSquadLead?.employeeId }
							)}
							value={getFieldValue("squadLeaderId")}
							onAdd={onAdd}
						/>
					)
				}}
			</Form.Item>

		</Form.Item>
		<Form.Item
			label="Розрахунок"
			name="squadIds"
			rules={[{ required: true, message: 'Обов\'язкове поле' }]}
		>
			<Form.List name="squadIds">
				{(fields, { add, remove }) => (
					<>
						{fields.map(({ key, name, ...restField }) => (
							<Form.Item
								key={key}
								noStyle
								shouldUpdate={() => true}
							>
								{({ getFieldValue }) => {
									const squadIds = getFieldValue("squadIds");
									const squadLeaderId = getFieldValue("squadLeaderId");

									const currentSelectedId = squadIds[name];
									const selected = selectedWorkers?.find(el => el.employeeId === currentSelectedId);

									return  (
										<Form.Item
											name={name}
											{...restField}
										>
											<Select
												options={select.append(
													workers
														.filter(el => el.id !== squadLeaderId)
												        .filter(el => el.id === currentSelectedId || !squadIds.includes(el.id))
														.map((el) => ({ label: el?.fullName, value: el.id })),
													{ label: selected?.fullName, value: selected?.employeeId }
												)}
												value={currentSelectedId}
												suffixIcon={
													currentSelectedId
													 ?<CloseOutlined
															onClick={() => {
																remove(name);
															}}
														/>
														: <DownOutlined />
												}
												onAdd={onAdd}
											/>

										</Form.Item>

									)
								}}
							</Form.Item>
						))}
						<Form.Item
							noStyle
							shouldUpdate={() => true}
						>
							{({ getFieldValue }) => {
								const squadIds = getFieldValue("squadIds");
								const squadLeaderId = getFieldValue("squadLeaderId");

								const freeWorkers =  workers.filter(el => !(el.id === squadLeaderId || squadIds.includes(el.id)));

								return  !!freeWorkers.length && (
									<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
										Додати
									</Button>
								)
							}}
						</Form.Item>
					</>
				)}
			</Form.List>
		</Form.Item>
		
	
	</>
}