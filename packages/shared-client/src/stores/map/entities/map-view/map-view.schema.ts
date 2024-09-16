import { type Dayjs } from 'dayjs';
import { type ILinkedToDocumentDB } from 'shared-my';

import { type IMapViewActionDTO, type IMapViewActionDTOParams } from '~/api';
import { dates } from '~/common';
import { type ICircle, type ILine, type IPoint, type IPolygon } from '~/map';

export interface IMapViewActionData extends Omit<ILinkedToDocumentDB, 'executedAt'> {
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

export interface IMapViewActionDataParams {
    id?: string;
    marker?: IPoint;
    circle?: ICircle;
    line?: ILine;
    polygon?: IPolygon;
    zoom: number;
}

export const createMapViewDTO = (value?: IMapViewActionDataParams): IMapViewActionDTOParams => ({
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

export const createMapView = (value: IMapViewActionDTO): IMapViewActionData => ({
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
