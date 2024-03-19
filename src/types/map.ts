export interface IPoint {
    lat: number, 
	lng: number,
}

export interface ICircle {
    center: IPoint,
    radius: number
}

export interface IPolygon {
    points: IPoint[],
}

