import { useCallback } from 'react';

import { Form} from 'antd';

import { Select } from '~/components'
import { Modal } from '~/services'
import { MODALS, WIZARD_MODE } from '~/constants'
import { IMissionRequest, IOrder } from '~/stores';


interface DocumentsProps {
	orderData: IOrder[];
	missionRequestData: IMissionRequest[];
}

export function Documents({ missionRequestData, orderData }: DocumentsProps) {
	const onAddOrder = useCallback( () => {
		Modal.show(MODALS.ORDER_WIZARD, { mode: WIZARD_MODE.CREATE})
	}, []);

	const onAddMissionRequest = useCallback( () => {
		Modal.show(MODALS.MISSION_REQUEST_WIZARD, { mode: WIZARD_MODE.CREATE})
	}, []);

	return (
		<>
			<Form.Item
				label="Наказ"
				name="orderId"
				rules={[{ required: true, message: 'Обов\'язкове поле' }]}
			>
				<Select
					onAdd={onAddOrder}
					options={orderData.map((el) => ({ label: `№${el.number} ${el.signedAt.format('DD/MM/YYYY')}`, value: el.id }))}
				/>
			</Form.Item>
			<Form.Item
				label="Заявка"
				name="missionRequestId"
				rules={[{ required: true, message: 'Обов\'язкове поле' }]}
			>
				<Select
					onAdd={onAddMissionRequest}
					options={missionRequestData.map((el) => ({ label: `№${el.number} ${el.signedAt.format('DD/MM/YYYY')}`, value: el.id }))}
				/>
			</Form.Item>
		</>
	)
}