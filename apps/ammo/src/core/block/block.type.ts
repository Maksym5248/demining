import { type IViewStyle } from '~/types';

export interface IBlockProps extends React.PropsWithChildren {
    title?: string;
    require?: boolean;
    hidden?: boolean;
    style?: IViewStyle;
}
