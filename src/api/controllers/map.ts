import { DB } from '~/db'

import { IGetAllInRectParams, IMapViewActionDTO } from '../types';
import { mapDBUtils } from '../map-util';

const getAllInRect = async (box: IGetAllInRectParams):Promise<IMapViewActionDTO[]> =>{
	const geoBox = mapDBUtils.getGeoBox(box.topLeft, box.bottomRight);
	
	const res = await DB.mapViewAction.select({
		where: {
			"geo.box.topLeft.hash": ['>=', geoBox.topLeft.hash],
			"geo.box.bottomRight.hash": ['<=', geoBox.bottomRight.hash],
		}
	});
    
	return res.filter((view) => {
		if ((view?.geo?.box?.topLeft?.lat ?? 0) >= geoBox.topLeft.lat && (view?.geo?.box?.topLeft?.lng ?? 0) >= geoBox.topLeft.lng &&
	            (view?.geo?.box?.bottomRight?.lat ?? 0) <= geoBox.bottomRight.lat && (view?.geo?.box?.bottomRight?.lng ?? 0) <= geoBox.bottomRight.lng
		) {
			return true;
		}

		return false
	})
};

export const map = {
	getAllInRect
}