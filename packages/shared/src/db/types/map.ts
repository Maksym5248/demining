import { type IBaseDB, type ILinkedToDocumentDB } from './common';

export interface IPointDB {
    lat: number;
    lng: number;
}

export interface IGeoPointDB extends IPointDB {
    lat: number;
    lng: number;
    hash: string;
}

export interface IGeoBoxDB {
    topLeft: IGeoPointDB;
    bottomRight: IGeoPointDB;
}

export interface IGeoBoxHashDB {
    topLeft: string;
    bottomRight: string;
}

export interface IGeoDB {
    center: IGeoPointDB;
    box: IGeoBoxDB | null;
}

export type IMarkerDB = IPointDB;

export interface ICircleDB {
    center: IPointDB;
    radius: number;
}

export interface ILineDB {
    points: IPointDB[];
    width: number;
}

export interface IPolygonDB {
    points: IPointDB[];
}

export interface IMapViewActionDB extends ILinkedToDocumentDB, IBaseDB {
    marker: IMarkerDB | null;
    circle: ICircleDB | null;
    line: ILineDB | null;
    polygon: IPolygonDB | null;
    zoom: number;
    geo: IGeoDB | null;
    authorId: string;
}
