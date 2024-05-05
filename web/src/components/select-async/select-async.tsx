import { JSXElementConstructor, ReactElement, useCallback } from 'react';

import { Button, Divider, Select as SelectAnt, SelectProps, Space, Spin } from 'antd';
import { BaseOptionType, DefaultOptionType } from 'antd/es/select';
import { PlusOutlined } from '@ant-design/icons';

interface ISelectAsync<T, B extends BaseOptionType | DefaultOptionType = DefaultOptionType> extends SelectProps<T, B > {
	loadingInput?: boolean;
	loadingMore?: boolean;
	isReachedEnd?: boolean;
	onLoadMore?: () => void;
	onAdd?: () => void
}

function SelectAsync<T, B extends BaseOptionType | DefaultOptionType = DefaultOptionType>({
	loading,
	loadingInput,
	loadingMore,
	isReachedEnd,
	onLoadMore,
	onAdd,
	...rest
}: ISelectAsync<T, B>) {

	const dropdownRender = useCallback(
		(menu:ReactElement<any, string | JSXElementConstructor<any>>) => (
			<>
				{menu}
				{(loading || loadingMore) &&(
					<div style={{ width: "100%", display: "flex", justifyContent: 'center', margin: 10}}><Spin /></div> 
				)}
				{(!isReachedEnd) &&(
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
				)}
				<Divider style={{ margin: '8px 0' }} />
				<Space style={{ padding: '0 8px 4px' }}>
					<Button type="text" icon={<PlusOutlined />} onClick={onAdd}>Додати</Button>
				</Space>
			</>
		),[onAdd, loading, isReachedEnd, loadingMore, onLoadMore]
	);
	
	const additionalProps = onAdd ? {dropdownRender} : {};

	return (
		<SelectAnt
			showSearch
			allowClear
			loading={loadingInput}
			filterOption={false}
			placeholder="Вибрати"
			{...additionalProps}
			{...rest}
		/>
	);
}

SelectAsync.Option = SelectAnt.Option

export {
	SelectAsync
}