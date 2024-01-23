import { JSXElementConstructor, ReactElement, useCallback } from 'react';

import { CloseOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Space} from 'antd';

import { Select } from '~/components'
import { MODALS } from '~/constants';
import { Modal } from '~/services';
import { IEmployee } from '~/stores';

interface IEmployeesProps {
	squadLeads:IEmployee[];
	workers:IEmployee[];
}

export function Employees({ squadLeads, workers }: IEmployeesProps ) {
	const onAdd = useCallback( () => {
		Modal.show(MODALS.EMPLOYEES_WIZARD)
	}, []);
	
	const dropdownRender = useCallback(
		(menu:ReactElement<any, string | JSXElementConstructor<any>>) => (
			<>
				{menu}
				<Divider style={{ margin: '8px 0' }} />
				<Space style={{ padding: '0 8px 4px' }}>
					<Button type="text" icon={<PlusOutlined />} onClick={onAdd}>Додати</Button>
				</Space>
			</>
		),[onAdd]
	);
	
	return <>
		<Form.Item
			label="Керівник розрахунку"
			name="squadLeadId"
			rules={[{ required: true, message: 'Обов\'язкове поле' }]}
		>
			<Form.Item
				noStyle
				shouldUpdate={() => true}
			>
				{({ getFieldValue }) => {
					const workersIds = getFieldValue("workersIds");

					return (
						<Select
							options={squadLeads
								.filter(el => !workersIds.includes(el.id))
								.map((el) => ({ label: el.fullName, value: el.id }))}
							value={getFieldValue("squadLeadId")}
							dropdownRender={dropdownRender}
						/>
					)
				}}
			</Form.Item>

		</Form.Item>
		<Form.Item
			label="Розрахунок"
			name="workersIds"
			rules={[{ required: true, message: 'Обов\'язкове поле' }]}
		>
			<Form.List name="workersIds">
				{(fields, { add, remove }) => (
					<>
						{fields.map(({ key, name, ...restField }) => (
							<Form.Item
								key={key}
								noStyle
								shouldUpdate={() => true}
							>
								{({ getFieldValue }) => {
									const workersIds = getFieldValue("workersIds");
									const squadLeadId = getFieldValue("squadLeadId");

									const currentSelectedId = workersIds[name];

									return  (
										<Form.Item
											name={name}
											{...restField}
										>
											<Select
												options={workers
													.filter(el => el.id !== squadLeadId)
												    .filter(el => el.id === currentSelectedId || !workersIds.includes(el.id))
													.map((el) => ({ label: el?.fullName, value: el.id }))
												}
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
												dropdownRender={dropdownRender}
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
								const workersIds = getFieldValue("workersIds");
								const squadLeadId = getFieldValue("squadLeadId");

								const freeWorkers =  workers.filter(el => !(el.id === squadLeadId || workersIds.includes(el.id)));

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