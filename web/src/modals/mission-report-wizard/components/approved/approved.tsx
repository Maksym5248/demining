import { Form, DatePicker} from 'antd';

import { Select } from '~/components'
import { Modal } from '~/services'
import { MODALS, WIZARD_MODE } from '~/constants'
import { IEmployee, IEmployeeAction } from '~/stores';
import { select } from '~/utils';


interface ApprovedProps {
	data: IEmployee[];
	selectedEmployee?: IEmployeeAction
}

export function Approved({ data, selectedEmployee }: ApprovedProps) {
	const onAddEmployee = () => {
		Modal.show(MODALS.EMPLOYEES_WIZARD,  { mode: WIZARD_MODE.CREATE})
	};

	return (
		<>
			<Form.Item
				label="Дата затвердження"
				name="approvedAt"
				rules={[{ required: true, message: 'Дата затвердження є обов\'язковим полем' }]}
			>
				<DatePicker />
			</Form.Item>
			<Form.Item
				label="Затвердив"
				name="approvedById"
				rules={[{ required: true, message: 'Обов\'язкове поле' }]}
			>
				<Select
					options={select.append(
						data.map((el) => ({ label: el.fullName, value: el.id })),
						{ label: selectedEmployee?.fullName, value: selectedEmployee?.employeeId }
					)}
					onAdd={onAddEmployee}
				/>
			</Form.Item>
		</>
	)
}