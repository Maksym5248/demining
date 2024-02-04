import { Button, Popconfirm, Space, Tooltip } from 'antd';

import { Icon } from '../icon';

interface DrawerExtraProps extends React.PropsWithChildren {
	onRemove?: () => void;
	onEdit?: () => void;
	onView?: () => void;
	onSave?: () => void;
	isView?: boolean;
	isEdit?: boolean;
	isRemove?: boolean;
	isSave?: boolean;
}

export function WizardButtons({
	onRemove,
	onEdit,
	onView, 
	onSave, 
	isView, 
	isEdit,
	isRemove,
	isSave, 
	children 
}: DrawerExtraProps ){	

	return (
		<Space>
			{children}
			{!!onSave && isSave && (
				<Tooltip placement="topLeft" title="Зберегти документ" arrow>
					<Button icon={<Icon.SaveOutlined/>} onClick={onSave}/>
				</Tooltip>
			)}
			{!!onEdit && isView && (
				<Tooltip placement="topLeft" title="Редагувати" arrow>
					<Button icon={<Icon.EditOutlined /> } onClick={onEdit}/>
				</Tooltip>
			)}
			{!!onView && isEdit && (
				<Tooltip placement="topLeft" title="Переглянути" arrow>
					<Button icon={<Icon.EyeOutlined /> } onClick={onView}/>
				</Tooltip>
			)}
			{!!onRemove && isRemove && (
				<Popconfirm
					title="Видалити"
					description="Ви впевнені, після цього дані не можливо відновити ?"
					onConfirm={onRemove}
					okText="Так"
					cancelText="Ні"
					
				>
					<Tooltip placement="topLeft" title="Видалити" arrow>
						<Button danger style={{ marginLeft: 20}} icon={<Icon.DeleteOutlined /> }/>
					</Tooltip>
				</Popconfirm>
			)}
		</Space>
	);
}