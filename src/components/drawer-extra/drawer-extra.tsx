import { Button, Popconfirm, Space, message } from 'antd';

import { Icon } from '../icon';

interface DrawerExtraProps extends React.PropsWithChildren {
	onRemove?: () => void
}

export function DrawerExtra({ onRemove, children }: DrawerExtraProps) {	
	const onCancel = () => {
		message.error('Скасовано');
	};

	return (
		<Space>
			{children}
			{!!onRemove && (
				<Popconfirm
					key="list-remove"
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