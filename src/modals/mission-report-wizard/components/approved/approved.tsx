import { JSXElementConstructor, ReactElement, useCallback} from 'react';

import { Button, Form, Space, DatePicker, Divider} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { Select } from '~/components'
import { Modal } from '~/services'
import { MODALS, WIZARD_MODE } from '~/constants'
import { IEmployee } from '~/stores';


interface MenuProps {
	menu: ReactElement<any, string | JSXElementConstructor<any>>;
}

interface ApprovedProps {
	data: IEmployee[];
}

function Menu({ menu }: MenuProps) {
	const onAddEmployee = () => {
		Modal.show(MODALS.EMPLOYEES_WIZARD,  { mode: WIZARD_MODE.CREATE})
	};

	return (
		<>
			{menu}
			<Divider style={{ margin: '8px 0' }} />
			<Space style={{ padding: '0 8px 4px' }}>
				<Button type="text" icon={<PlusOutlined />} onClick={onAddEmployee}>Додати керівника</Button>
			</Space>
		</>
	)
}

export function Approved({ data }: ApprovedProps) {
	const dropdownRender = useCallback(
		(menu:ReactElement<any, string | JSXElementConstructor<any>>) =>
		 <Menu menu={menu}/>,
		[]);

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
					options={data.map((el) => ({ label: el.fullName, value: el.id }))}
					dropdownRender={dropdownRender}
				/>
			</Form.Item>
		</>
	)
}