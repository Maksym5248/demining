import { Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';

import { Modal } from '~/services'
import { MODALS } from '~/constants'
import { useStore } from '~/hooks'
import { Icon, List } from '~/components';
import { IExplosiveObjectActionValueParams } from '~/stores';

import { ListItemProps } from "./explosive-object-action.types";
import { s } from "./explosive-object-action.styles";

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

const ObservedListItem = observer(ListItem);

function Component() {

	return (
		<Form.Item label="ВНП" name="explosiveObjectActions" rules={[{ required: true, message: 'Є обов\'язковим полем' }]} css={s.item} >
			<Form.Item noStyle shouldUpdate={() => true} >
				{({ getFieldValue, setFieldValue }) => {
					const data = getFieldValue("explosiveObjectActions");

					return (
						<List
							size="small"
							pagination={false}
							dataSource={data.map((el:IExplosiveObjectActionValueParams, i:number) => ({...el, id: `${i}`}))}
							renderItem={(item:IExplosiveObjectActionValueParams & { id: string}, i:number) => (
								<ObservedListItem
								    item={item}
								    index={i} 
								    onRemove={(index:number) => {
										setFieldValue("explosiveObjectActions", data.filter((el:IExplosiveObjectActionValueParams, c:number) =>c !== index));
									}}
								/>
							)}
							footer={
								<Button
							 		type="dashed"
							  		block 
							  		icon={<PlusOutlined />}
							   		onClick={() => {
										Modal.show(MODALS.EXPLOSIVE_OBJECT_ACTION_WIZARD, {
											onSubmit: (value: IExplosiveObjectActionValueParams) => setFieldValue("explosiveObjectActions", [...data, value])
										})
									}}
							   >
								Додати
								</Button>
							}
						/>
					)
				}}
		
			</Form.Item>
		</Form.Item>
	);
}

export const ExplosiveObjectAction = Component;