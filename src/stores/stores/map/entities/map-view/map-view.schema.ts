import { Dayjs } from 'dayjs';

import { dates } from '~/utils';
import { IMapViewActionDTO, IMapViewActionDTOParams } from '~/api';
import { ILinkedToDocumentDB } from '~/db';
import { ICircle, IPoint } from '~/types';



export interface IMapViewActionValue extends ILinkedToDocumentDB {
    id: string;
    marker?: IPoint;
    circle?: ICircle;
    zoom: number;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IMapViewActionValueParams extends IMapViewActionValue {
	id: string;
    marker: IPoint;
    circle?: ICircle;
    zoom: number;
};


export const createMapViewDTO = (value?: IMapViewActionValueParams): IMapViewActionDTOParams  => ({
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
	zoom: value.zoom,
	createdAt: dates.create(value.createdAt),
	updatedAt: dates.create(value.updatedAt),
});
