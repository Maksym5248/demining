import { isArray } from 'lodash';

interface Option {
    label: string;
    value: string;
}

const append = (options: Option[], newOption: Partial<Option> | Partial<Option>[]) => {
    const arr = isArray(newOption) ? newOption : [newOption];
    const arrFiltered = arr.filter((el) => !!el.value);

    if (!arrFiltered?.length) return options;

    const optionsValue = options.filter(
        (el) => !arrFiltered.find((item) => el.value === item.value),
    );

    return [...arrFiltered, ...optionsValue];
};

export const select = {
    append,
};
