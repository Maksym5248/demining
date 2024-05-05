import { Button, List as ListAnt, ListProps, Spin } from 'antd';


interface IList<T> extends ListProps<T>{
	loadingMore?: boolean;
	isReachedEnd?: boolean;
	onLoadMore?: () => void;
}
export function List<T extends { id: string }>({
	loading,
	loadingMore,
	isReachedEnd,
	onLoadMore,
	dataSource,
	...props
}: IList<T>) {

	let loadMore = null;
	
	if(!!onLoadMore && !loading && !isReachedEnd && !loadingMore && !!dataSource?.length){
		loadMore = (
			<div
    		style={{
    			textAlign: 'center',
    			marginTop: 12,
    			height: 32,
    			lineHeight: '32px',
    		}}
    	>
    		<Button onClick={() => onLoadMore?.()}>Завантажити більше</Button>
    	</div>
		)
	} else if(!loading && !isReachedEnd && loadingMore){
		loadMore = ( <div style={{ width: "100%", display: "flex", justifyContent: 'center', margin: 10}}><Spin /></div> )
	}
	
	return (
		<ListAnt
			rowKey="id"
			itemLayout="horizontal"
			loading={loading}
			loadMore={loadMore}
			dataSource={dataSource}
			{...props}
		/>
	);
}

List.Item = ListAnt.Item
List.Item.Meta = ListAnt.Item.Meta