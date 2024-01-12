import { List as ListAnt, ListProps } from 'antd';


export function List<T extends { id: string }>(props: ListProps<T>) {
	return (
		<ListAnt
			rowKey="id"
			itemLayout="horizontal"
			pagination={{
				position: "bottom",
				align: "center",
			}}
			{...props}
		/>
	);
}

List.Item = ListAnt.Item
List.Item.Meta = ListAnt.Item.Meta