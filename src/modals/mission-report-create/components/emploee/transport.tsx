import { Form, Select} from 'antd';

import { TRANSPORT_TYPE } from '~/constants';
import { ITransport } from '~/stores';

export function Transport({ data }: { data:ITransport[]} ) {
	return <>
		<Form.Item
			label="Авто для ВР"
			name="transportExplosiveObjectId"
			rules={[{ required: true, message: 'Обов\'язкове поле' }]}
		>
			<Select
				options={data
					.filter(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS)
					.map((el) => ({ label: el.fullName, value: el.id }))
				}
			/>
		</Form.Item>
		<Form.Item
			label="Авто для О/С"
			name="transportHumansId"
			rules={[{ required: true, message: 'Обов\'язкове поле' }]}
		>
			<Select
				options={data
					.filter(el => el.type === TRANSPORT_TYPE.FOR_HUMANS)
					.map((el) => ({ label: el.fullName, value: el.id }))
				}
			/>
		</Form.Item>
	</>
}