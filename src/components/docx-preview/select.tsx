import { useCallback } from 'react';

import { Select as SelectAnt, SelectProps } from 'antd';
import { BaseOptionType, DefaultOptionType } from 'antd/es/select';


function Select<T, B extends BaseOptionType | DefaultOptionType = DefaultOptionType>(props: SelectProps<T, B>) {
	const filterOption = useCallback((input: string, option: B | undefined) => {
		const itemValue = String(option?.label)?.toLowerCase().trim();
		const searchValue = input.toLowerCase().trim();

		return itemValue.includes(searchValue);
	}, []);

	
	return (
		<SelectAnt
			showSearch
			allowClear
			filterOption={filterOption}
			{...props}
		/>
	);
}

Select.Option = SelectAnt.Option

export {
	Select
}