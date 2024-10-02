export interface IPoint {
    lat: number;
    lng: number;
}

export interface ISimpleLine {
    start: IPoint;
    end: IPoint;
}

export type IMarker = IPoint;

export interface ICircle {
    center: IPoint;
    radius: number;
}

export interface ILine {
    points: IPoint[];
    width: number;
}

export interface IPolygon {
    points: IPoint[];
}

export interface IGeoBox {
    topLeft: IPoint;
    bottomRight: IPoint;
}

export interface IGeohashRange {
    start: string;
    end: string;
}

export enum DrawingType {
    MOVE = 'move',
    MARKER = 'marker',
    CIRCLE = 'circle',
    LINE = 'line',
    POLYGON = 'polygon',
}
