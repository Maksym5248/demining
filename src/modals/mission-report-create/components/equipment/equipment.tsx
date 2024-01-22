import { Form} from 'antd';

import { Select } from '~/components'
import { EQUIPMENT_TYPE } from '~/constants';
import { IEquipment } from '~/stores';

export function Equipment({ data }: { data:IEquipment[]} ) {
	return <Form.Item
		label="Міношукач"
		name="mineDetectorId"
		rules={[{ required: true, message: 'Обов\'язкове поле' }]}
	>
		<Select
			options={data
				.filter(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR)
				.map((el) => ({ label: el.name, value: el.id }))
			}
		/>
	</Form.Item>
}