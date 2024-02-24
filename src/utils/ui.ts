
interface Option {
    label: string;
    value: string
}

const append = (options: Option[], newOption: Partial<Option>) => {
	if(!newOption?.value || !newOption?.label){
		return options
	}

	if(options.find(el => el.value === newOption?.value)) {
		return options
	}

	return newOption?.value &&  newOption?.label ? [
		...(newOption ? [newOption] : []),
		...options
	]: options
};

export const select = {
	append
}