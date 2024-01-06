import { JSXElementConstructor, ReactElement, useCallback} from 'react';

import { Button, Form, Space, Select, Divider} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { Modal } from '~/services'
import { MODALS } from '~/constants'
import { IMissionRequest, IOrder } from '~/stores';


interface DocumentsProps {
	orderData: IOrder[];
	missionRequestData: IMissionRequest[];
}

export function Documents({ missionRequestData, orderData }: DocumentsProps) {
	const onAddOrder = useCallback( () => {
		Modal.show(MODALS.ORDER_CREATE)
	}, []);

	const onAddMissionRequest = useCallback( () => {
		Modal.show(MODALS.MISSION_REQUEST_CREATE)
	}, []);

	const dropdownRenderOrder = useCallback(
		(menu:ReactElement<any, string | JSXElementConstructor<any>>) => (
			<>
				{menu}
				<Divider style={{ margin: '8px 0' }} />
				<Space style={{ padding: '0 8px 4px' }}>
					<Button type="text" icon={<PlusOutlined />} onClick={onAddOrder}>Додати наказ</Button>
				</Space>
			</>
		),[onAddOrder]
	);

	const dropdownRenderMissionRequest = useCallback(
		(menu:ReactElement<any, string | JSXElementConstructor<any>>) => (
			<>
				{menu}
				<Divider style={{ margin: '8px 0' }} />
				<Space style={{ padding: '0 8px 4px' }}>
					<Button type="text" icon={<PlusOutlined />} onClick={onAddMissionRequest}>Додати заявку</Button>
				</Space>
			</>
		),[onAddMissionRequest]
	);

	return (
		<>
			<Form.Item
				label="Наказ"
				name="orderId"
				rules={[{ required: true, message: 'Обов\'язкове поле' }]}
			>
				<Select
					dropdownRender={dropdownRenderOrder}
					options={orderData.map((el) => ({ label: `№${el.number} ${el.signedAt.format('DD/MM/YYYY')}`, value: el.id }))}
				/>
			</Form.Item>
			<Form.Item
				label="Заявка"
				name="missionRequestId"
				rules={[{ required: true, message: 'Обов\'язкове поле' }]}
			>
				<Select
					dropdownRender={dropdownRenderMissionRequest}
					options={missionRequestData.map((el) => ({ label: `№${el.number} ${el.signedAt.format('DD/MM/YYYY')}`, value: el.id }))}
				/>
			</Form.Item>
		</>
	)
}