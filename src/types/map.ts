export interface IPoint {
    lat: number, 
	lng: number,
}

export interface IMarker extends IPoint {}

export interface ICircle {
    center: IPoint,
    radius: number
}

export interface IPolygon {
    points: IPoint[],
}

export interface IGeoBox {
    topLeft: IPoint,
    bottomRight: IPoint
}

