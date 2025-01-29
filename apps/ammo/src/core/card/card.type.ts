import { type IViewStyle } from '~/types';

import { type ISvgName } from '../svg';
import { type ITouchable } from '../touchable';

export interface ICardProps extends Omit<ITouchable, 'children' | 'type'> {
    type?: 'default' | 'image';
    title?: string;
    style?: IViewStyle;
    children?: React.ReactNode;
    svg?: ISvgName;
    uri?: string | null;
}
