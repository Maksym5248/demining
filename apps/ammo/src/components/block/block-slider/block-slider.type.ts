export interface ISlide {
    uri: string;
    id: number;
}

export interface IBlockSliderProps {
    description?: string;
    slides: ISlide[];
    label: string;
}
