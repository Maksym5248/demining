import { isArray } from "lodash";

interface Option {
    label: string;
    value: string
}

const append = (options: Option[], newOption: Partial<Option> | Partial<Option>[]) => {
	const optionValue = isArray(newOption) ? newOption : [newOption];

	if(!optionValue?.length){
		return options
	}

	const optionsValue = options.filter(el => !optionValue.find(item => el.value === item.value))

	return [
		...optionValue,
		...optionsValue
	]
};

export const select = {
	append
}