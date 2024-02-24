import { Form} from 'antd';

import { Select } from '~/components'
import { EQUIPMENT_TYPE, MODALS, WIZARD_MODE } from '~/constants';
import { Modal } from '~/services';
import { IEquipment, IEquipmentAction } from '~/stores';
import { select } from '~/utils';

export function Equipment({ data, selectedMineDetector }: { data:IEquipment[], selectedMineDetector?: IEquipmentAction} ) {
	const onAdd = () => Modal.show(MODALS.EQUIPMENT_WIZARD, { mode: WIZARD_MODE.CREATE})
	
	return <Form.Item
		label="Міношукач"
		name="mineDetectorId"
		rules={[{ required: true, message: 'Обов\'язкове поле' }]}
	>
		<Select
			options={select.append(
				data
					.filter(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR)
					.map((el) => ({ label: el.name, value: el.id })),
				{ label: selectedMineDetector?.name, value: selectedMineDetector?.equipmentId }
			)}
			onAdd={onAdd}
		/>
	</Form.Item>
}