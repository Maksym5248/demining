import { DB } from '~/db'

import { IGetAllInRectParams, IMapViewActionDTO } from '../types';
import { mapDBUtils } from '../map-util';

const getAllInGeoBox = async (box: IGetAllInRectParams):Promise<IMapViewActionDTO[]> =>{
	const bounds = mapDBUtils.getBoundsByGeoBox(box);

	const promises = bounds.map(b => DB.mapViewAction.select({
		order: {
			by: "geo.center.hash",
		},
		startAt: b[0],
		endAt: b[1],
	}));

	const res = await Promise.all(promises);
	const matchingDocs:IMapViewActionDTO[] = [];

	res.forEach(snap => {
		snap.forEach(doc => {
			matchingDocs.push(doc);
		})
	})

	return matchingDocs;
};

export const map = {
	getAllInGeoBox,
}