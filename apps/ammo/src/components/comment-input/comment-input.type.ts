import { type ICommentInputModel } from '~/models';
import { type IViewStyle } from '~/types';

export interface ICommentInputProps {
    item: ICommentInputModel;
    style?: IViewStyle;
    onLayout?: (event: any) => void;
}
