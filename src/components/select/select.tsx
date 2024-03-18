import { JSXElementConstructor, ReactElement, useCallback } from 'react';

import { Button, Divider, Select as SelectAnt, SelectProps, Space } from 'antd';
import { BaseOptionType, DefaultOptionType } from 'antd/es/select';
import { PlusOutlined } from '@ant-design/icons';

interface ISelect<T, B extends BaseOptionType | DefaultOptionType = DefaultOptionType> extends SelectProps<T, B > {
	onAdd?: () => void
}

function Select<T, B extends BaseOptionType | DefaultOptionType = DefaultOptionType>({ onAdd, ...rest}: ISelect<T, B>) {
	const filterOption = useCallback((input: string, option: B | undefined) => {
		const itemValue = String(option?.label)?.toLowerCase().trim();
		const searchValue = input.toLowerCase().trim();

		return itemValue.includes(searchValue);
	}, []);

	const dropdownRender = useCallback(
		(menu:ReactElement<any, string | JSXElementConstructor<any>>) => (
			<>
				{menu}
				<Divider style={{ margin: '8px 0' }} />
				<Space style={{ padding: '0 8px 4px' }}>
					<Button type="text" icon={<PlusOutlined />} onClick={onAdd}>Додати</Button>
				</Space>
			</>
		),[onAdd]
	);
	
	const addtitionalProps = onAdd ? {dropdownRender} : {};

	return (
		<SelectAnt
			showSearch
			allowClear
			filterOption={filterOption}
			placeholder="Вибрати"
			{...addtitionalProps}
			{...rest}
		/>
	);
}

Select.Option = SelectAnt.Option

export {
	Select
}