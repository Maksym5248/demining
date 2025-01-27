import { type IViewStyle } from '~/types';

import { type ITouchable } from '../touchable';

export interface ICardProps extends Omit<ITouchable, 'children'> {
    title?: string;
    style?: IViewStyle;
    children?: React.ReactNode;
}
