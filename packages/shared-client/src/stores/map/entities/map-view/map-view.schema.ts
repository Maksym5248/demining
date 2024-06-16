import { type DOCUMENT_TYPE, type ILinkedToDocumentDB } from '@/shared';
import { type Dayjs } from 'dayjs';

import { type IMapViewActionDTO, type IMapViewActionDTOParams } from '~/api';
import { type ICircle, type ILine, type IPoint, type IPolygon } from '@/shared-client';
import { dates } from '~/utils';

export interface IMapViewActionValue extends Omit<ILinkedToDocumentDB, 'executedAt'> {
    id: string;
    marker?: IPoint;
    circle?: ICircle;
    polygon?: IPolygon;
    line?: ILine;
    zoom: number;
    executedAt?: Dayjs;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IMapViewActionValueParams {
    id?: string;
    marker?: IPoint;
    circle?: ICircle;
    line?: ILine;
    polygon?: IPolygon;
    zoom: number;
}

export const createMapViewDTO = (value?: IMapViewActionValueParams): IMapViewActionDTOParams => ({
    marker: value?.marker
        ? {
              lat: value?.marker?.lat,
              lng: value?.marker?.lng,
          }
        : null,
    circle: value?.circle
        ? {
              center: {
                  lat: value.circle.center.lat,
                  lng: value.circle.center.lng,
              },
              radius: value.circle.radius,
          }
        : null,
    line: value?.line
        ? {
              points: value?.line?.points.map((el) => ({
                  lat: el.lat,
                  lng: el.lng,
              })),
              width: value.line.width,
          }
        : null,
    polygon: value?.polygon
        ? {
              points: value?.polygon?.points.map((el) => ({
                  lat: el.lat,
                  lng: el.lng,
              })),
          }
        : null,
    zoom: value?.zoom ?? 1,
});

export const createMapView = (value: IMapViewActionDTO): IMapViewActionValue => ({
    id: value.id,
    documentId: value.documentId,
    documentType: value.documentType,
    marker: value?.marker
        ? {
              lat: value?.marker?.lat,
              lng: value?.marker?.lng,
          }
        : undefined,
    circle: value?.circle
        ? {
              center: {
                  lat: value.circle.center.lat,
                  lng: value.circle.center.lng,
              },
              radius: value.circle.radius,
          }
        : undefined,
    polygon: value?.polygon
        ? {
              points: value?.polygon?.points.map((el) => ({
                  lat: el.lat,
                  lng: el.lng,
              })),
          }
        : undefined,
    line: value?.line
        ? {
              points: value?.line?.points.map((el) => ({
                  lat: el.lat,
                  lng: el.lng,
              })),
              width: value.line.width,
          }
        : undefined,
    zoom: value.zoom,
    createdAt: dates.fromServerDate(value.createdAt),
    executedAt: value.executedAt ? dates.fromServerDate(value.executedAt) : undefined,
    updatedAt: dates.fromServerDate(value.updatedAt),
});

export class MapViewActionValue {
    id: string;
    documentId: string;
    documentType: DOCUMENT_TYPE;
    marker?: IPoint;
    circle?: ICircle;
    polygon?: IPolygon;
    line?: ILine;
    zoom: number;
    executedAt?: Dayjs;
    createdAt: Dayjs;
    updatedAt: Dayjs;

    constructor(value: IMapViewActionValue) {
        this.id = value.id;
        this.documentId = value.documentId;
        this.documentType = value.documentType;
        this.marker = value.marker;
        this.circle = value.circle;
        this.polygon = value.polygon;
        this.line = value.line;
        this.zoom = value.zoom;
        this.executedAt = value?.executedAt;
        this.createdAt = value.createdAt;
        this.updatedAt = value.updatedAt;
    }
}
