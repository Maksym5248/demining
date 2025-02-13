import { type IOption, type IViewStyle } from '~/types';

export interface IChipsProps<T> {
    options?: IOption<T> | IOption<T>[];
    style?: IViewStyle;
    onRemove?: (options: IOption<T>) => void;
}
