import { JSXElementConstructor, ReactElement, useCallback } from 'react';

import { CloseOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Space} from 'antd';

import { Select } from '~/components'
import { MODALS, WIZARD_MODE } from '~/constants';
import { Modal } from '~/services';
import { IEmployee } from '~/stores';

interface IEmployeesProps {
	squadLeads:IEmployee[];
	workers:IEmployee[];
}

export function Employees({ squadLeads, workers }: IEmployeesProps ) {
	const onAdd = useCallback( () => {
		Modal.show(MODALS.EMPLOYEES_WIZARD,  { mode: WIZARD_MODE.CREATE})
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
							options={squadLeads
								.filter(el => !squadIds.includes(el.id))
								.map((el) => ({ label: el.fullName, value: el.id }))}
							value={getFieldValue("squadLeaderId")}
							dropdownRender={dropdownRender}
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

									return  (
										<Form.Item
											name={name}
											{...restField}
										>
											<Select
												options={workers
													.filter(el => el.id !== squadLeaderId)
												    .filter(el => el.id === currentSelectedId || !squadIds.includes(el.id))
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