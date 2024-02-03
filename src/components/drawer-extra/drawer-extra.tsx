import { Button, Popconfirm, Space, message } from 'antd';

import { Icon } from '../icon';

interface DrawerExtraProps extends React.PropsWithChildren {
	onRemove?: () => void;
	onEdit?: () => void;
	onView?: () => void;
	isView?: boolean;
	isEdit?: boolean;
	isRemove?: boolean;
}

export function DrawerExtra({ onRemove, onEdit, onView, isView, isEdit, isRemove, children }: DrawerExtraProps) {	
	const onCancel = () => {
		message.error('Скасовано');
	};

	return (
		<Space>
			{children}
			{!!onEdit && isView && (
				<Button icon={<Icon.EditOutlined /> } onClick={onEdit}/>
			)}
			{!!onView && isEdit && (
				<Button icon={<Icon.EyeOutlined /> } onClick={onView}/>
			)}
			{!!onRemove && isRemove && (
				<Popconfirm
					title="Видалити"
					description="Ви впевнені, після цього дані не можливо відновити ?"
					onConfirm={onRemove}
					onCancel={onCancel}
					okText="Так"
					cancelText="Ні"
				>
					<Button key="list-remove" icon={<Icon.DeleteOutlined style={{ color: "red"}}/> }/>
				</Popconfirm>
			)}
		</Space>
	);
}