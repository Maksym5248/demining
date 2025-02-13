import { type IOption, type IViewStyle } from '~/types';

export interface IButtonsRadioProps<T> {
    value?: T;
    options: IOption<T>[];
    onPress: (value: IOption<T>) => void;
    style?: IViewStyle;
}
