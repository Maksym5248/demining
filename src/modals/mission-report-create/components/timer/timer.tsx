import { Form, TimePicker} from 'antd';

export function Timer() {
	return <>
		<Form.Item
			label="Початок:"
			name="workStart"
		>
			<TimePicker format="HH:mm"/>
		</Form.Item>
		<Form.Item
			label="Виявлення з:"
			name="exclusionStart"
		>
			<TimePicker format="HH:mm"/>
		</Form.Item>
		<Form.Item
			label="Транспортування з:"
			name="transportingStart"
		>
			<TimePicker format="HH:mm"/>
		</Form.Item>
		<Form.Item
			label="Знищення з:"
			name="destroyedStart"
		>
			<TimePicker format="HH:mm"/>
		</Form.Item>
		<Form.Item
			label="Завершення робіт"
			name="workEnd"
		>
			<TimePicker format="HH:mm"/>
		</Form.Item>
	</>
}