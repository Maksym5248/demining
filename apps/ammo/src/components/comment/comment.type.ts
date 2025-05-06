import { type ICommentModel } from '~/models';
import { type IViewStyle } from '~/types';

export interface ICommentViewProps {
    item: ICommentModel;
    style?: IViewStyle;
}
