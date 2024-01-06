
import { Form, Input, InputNumber} from 'antd';

import { s } from "./territory.styles"

export function Territory() {
	return (
		<>
			<Form.Item label="Обстежено, м2" css={s.item}>
				<Form.Item
					name="checkedTerritory"
					rules={[{ required: true }]}
					css={s.first}
				>
					<InputNumber size="middle" min={1} max={100000} />
				</Form.Item>
				<Form.Item
					name="depthExamination"
					label="на глибину, м"
					css={s.last}
				>
					<InputNumber size="middle" min={1} max={100000}/>
				</Form.Item>
			</Form.Item>
			<Form.Item label="Не можливо обстежити, м2" css={s.item}>
				<Form.Item
					name="uncheckedTerritory"
					rules={[{ required: true }]}
					css={s.first}
				>
					<InputNumber size="middle" min={1} max={100000} />
				</Form.Item>
			</Form.Item>
			<Form.Item
				label="Причина"
				name="uncheckedReason"
				css={s.item}
			>
				<Input size="middle" />
			</Form.Item>
		</>
	)
}