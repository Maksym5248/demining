import { type IViewStyle } from '~/types';

export interface IOption<T> {
    value: T;
    title: string;
}

export interface IButtonsRadioProps<T> {
    value?: T;
    options: IOption<T>[];
    onPress: (value: IOption<T>) => void;
    style?: IViewStyle;
}
