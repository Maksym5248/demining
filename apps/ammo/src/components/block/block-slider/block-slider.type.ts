import { type IBlockViewProps } from '../block-view/block-view.type';

export interface ISlide {
    uri: string;
    id: number;
}

export interface IBlockSliderProps extends IBlockViewProps {
    description?: string;
    data: ISlide[];
    label: string;
}
