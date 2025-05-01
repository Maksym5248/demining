import { type IBlockProps } from '~/core';
import { type ISectionCarouselModel } from '~/models';

export interface ISlide {
    uri: string;
    id: number;
}

export interface ISectionCarouselProps extends IBlockProps {
    title: string;
    item: ISectionCarouselModel;
}
