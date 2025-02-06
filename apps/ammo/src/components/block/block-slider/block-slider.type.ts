export interface ISlide {
    uri: string;
    id: number;
}

export interface IBlockSliderProps {
    description?: string;
    data: ISlide[];
    label: string;
}
