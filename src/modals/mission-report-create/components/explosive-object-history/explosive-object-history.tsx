import { memo } from 'react';

import { Button, List, Form } from 'antd';

import { Icon } from '~/components';
import { Modal } from '~/services'
import { MODALS } from '~/constants'
import { useStore } from '~/hooks'

import { ListItemProps, IExplosiveObjectHistoryListProps, IExplosiveObjectHistoryListItem } from "./explosive-object-history.types";
import { s } from "./explosive-object-history.styles";

const getIcon = (isDone: boolean) => isDone ? "+": "-";

function ListItem({ item, index, onRemove }: ListItemProps) {
	const store = useStore();
	const _onRemove = () => onRemove?.(index);

	const explosiveObject = store.explosiveObject.collection.get(item.explosiveObjectId)
  
	return (
		<List.Item
			actions={[
				<Button
					key="list-remove" 
					icon={<Icon.DeleteOutlined style={{ color: "red"}}/>} 
					onClick={_onRemove}/>
			]}
		>
			<List.Item.Meta
				title={`${explosiveObject.fullDisplayName}; Категорія: ${item.category}; ${item.quantity} од.`}
				description={
					`Виявлено ${getIcon(item.isDiscovered)}; Транспортовано ${getIcon(item.isTransported)}; Знищено ${getIcon(item.isDestroyed)}: `
				}
			/>   
		</List.Item>
	)
}


function Component({onUpdate, data}: IExplosiveObjectHistoryListProps) {
	const onAddExplosiveObjectHistory = () => {
		Modal.show(MODALS.EXPLOSIVE_OBJECT_HISTORY_CREATE, {
			onSubmit: (value: IExplosiveObjectHistoryListItem) => onUpdate([...data, value]),
		})
	};

	const onRemove = (index:number) => {
		onUpdate(data.filter((item, i) => i !== index));
	};

	const renderItem = (item:IExplosiveObjectHistoryListItem, i:number) => <ListItem item={item} index={i} onRemove={onRemove} />;
	const Footer = <Button type="text" onClick={onAddExplosiveObjectHistory}>Додати</Button>;

	return (
		<Form.Item label="ВНП" css={s.item}>
			<List
				size="small"
				dataSource={data}
				renderItem={renderItem}
				footer={Footer}
			/>
		</Form.Item>
	);
}

export const ExplosiveObjectHistory = memo(Component);