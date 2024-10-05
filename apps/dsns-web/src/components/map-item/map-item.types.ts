import { type ICircle, type ILine, type IPoint, type IPolygon } from 'shared-my-client';

export interface IMapItem {
    id: string;
    data: {
        marker?: IPoint;
        circle?: ICircle;
        polygon?: IPolygon;
        line?: ILine;
    };
}

export interface IMapItemProps<T extends IMapItem> {
    item: T;
    onClick?: (item: T) => void;
    isSelected?: boolean;
    isClickable?: boolean;
}
