import { type Field as FieldMRF } from 'mobx-react-form';
import { type ERROR_MESSAGE, isString } from 'shared-my';

export interface IField {
    value: any;
    onChangeValue: (value: string) => void;
    id: string;
    name: string;
    label?: string;
    placeholder?: string;
    error?: {
        message: string;
        value: string;
    };
    isValid: boolean;
    isDirty: boolean;
    onFocus: () => void;
    onBlur: () => void;
    setError: (message: ERROR_MESSAGE) => void;
    setValue: (value: string) => void;
}

const getError = (field: FieldMRF, form: { isRunned: boolean }) => {
    if (!form.isRunned) {
        return {
            message: '',
            value: '',
        };
    }

    if (isString(field.error)) {
        return {
            message: field.error,
            value: '',
        };
    }

    return {
        // @ts-ignore
        message: field.error?.message as unknown as string,
        // @ts-ignore
        value: field.error?.value as unknown as string,
    };
};

export const createField = (field: FieldMRF, form: { isRunned: boolean }): IField => {
    return {
        value: field.value,
        onChangeValue: (text: string) => field.onChange(text),
        id: field.id,
        name: field.name,
        error: getError(field, form),
        isValid: form.isRunned ? field.isValid : true,
        isDirty: field.isDirty,
        onFocus: () => {
            field.onFocus();
        },
        onBlur: () => {
            field.onBlur();
        },
        setError: (message: ERROR_MESSAGE) => {
            field.invalidate(message);
        },
        setValue: (value: string) => {
            field.onChange(value);
        },
    };
};
