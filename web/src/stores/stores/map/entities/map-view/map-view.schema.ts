import { Dayjs } from 'dayjs';
import { ILinkedToDocumentDB } from 'shared';

import { dates } from '~/utils';
import { IMapViewActionDTO, IMapViewActionDTOParams } from '~/api';
import { ICircle, ILine, IPoint, IPolygon } from '~/types';



export interface IMapViewActionValue extends Omit<ILinkedToDocumentDB, "executedAt"> {
    id: string;
    marker?: IPoint;
    circle?: ICircle;
	polygon?: IPolygon;
	line?: ILine;
    zoom: number;
	executedAt?: Date;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IMapViewActionValueParams extends IMapViewActionValue {
	id: string;
    marker: IPoint;
    circle?: ICircle;
	line?: ILine;
	polygon?: IPolygon;
    zoom: number;
};


export const createMapViewDTO = (value?: IMapViewActionValueParams): IMapViewActionDTOParams  => ({
	executedAt: value?.executedAt ? dates.toDateServer(value?.executedAt) : null,
	marker: value?.marker ? {
		lat: value?.marker?.lat,
		lng: value?.marker?.lng
	} : null,
	circle: value?.circle ? {
		center: {
			lat: value.circle.center.lat,
			lng: value.circle.center.lng,
		},
		radius: value.circle.radius,
	} : null,
	line: value?.line ? {
		points: value?.line?.points.map(el => ({
			lat: el.lat,
			lng: el.lng,
		})),
		width: value.line.width,
	} : null,
	polygon: value?.polygon ? {
		points: value?.polygon?.points.map(el => ({
			lat: el.lat,
			lng: el.lng,
		}))
	} : null,
	zoom: value?.zoom ?? 1,
});

export const createMapView = (value: IMapViewActionDTO): IMapViewActionValue => ({
	id: value.id,
	documentId: value.documentId,
	documentType: value.documentType,
	marker: value?.marker ? {
		lat: value?.marker?.lat,
		lng: value?.marker?.lng
	} : undefined,
	circle: value?.circle ? {
		center: {
			lat: value.circle.center.lat,
			lng: value.circle.center.lng,
		},
		radius: value.circle.radius,
	} : undefined,
	polygon: value?.polygon ? {
		points: value?.polygon?.points.map(el => ({
			lat: el.lat,
			lng: el.lng,
		}))
	} : undefined,
	line: value?.line ? {
		points: value?.line?.points.map(el => ({
			lat: el.lat,
			lng: el.lng,
		})),
		width: value.line.width,
	} : undefined,
	zoom: value.zoom,
	createdAt: dates.fromServerDate(value.createdAt),
	updatedAt: dates.fromServerDate(value.updatedAt),
});
