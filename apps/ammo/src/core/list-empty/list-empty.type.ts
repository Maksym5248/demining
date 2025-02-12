import { type IViewStyle } from '~/types';

import { type ISvgName } from '../svg';

export interface IListEmptyProps {
    title: string;
    name: ISvgName;
    style?: IViewStyle;
}
