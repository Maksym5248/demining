import { type Field as FieldMRF } from 'mobx-react-form';
import { isString } from 'shared-my';

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
}

export const createField = (field: FieldMRF): IField => ({
    value: field.value,
    onChangeValue: (text: string) => {
        console.log('onChangeValue', text);
        field.onChange(text);
    },
    id: field.id,
    name: field.name,
    error: isString(field.error)
        ? {
              message: field.error,
              value: '',
          }
        : {
              // @ts-ignore
              message: field.error?.message as unknown as string,
              // @ts-ignore
              value: field.error?.value as unknown as string,
          },
    isValid: field.isValid,
    isDirty: field.isDirty,
    onFocus: () => {
        field.onFocus();
    },
    onBlur: () => {
        field.onBlur();
    },
});
