import { useState } from "react";

import { ExternalApi } from "~/api";
import { useAsyncEffect } from "~/hooks";
import { ILatLng } from "~/types";

export const useCurrentLocation = (defaultValue?: ILatLng)  => {
	const [coords, setCoords] = useState<ILatLng | undefined>(defaultValue);
	const [isLoading, setLoading] = useState(true);

	useAsyncEffect(async () => {
		try {
			const location = await ExternalApi.getLocation();

			setCoords({
				lat: location.lat,
				lng: location.lon
			});
		  		} catch (e) {
			  console.error(e);
		}

		setLoading(false)
	}, []);

	return {
		isLoading,
		coords
	}
}