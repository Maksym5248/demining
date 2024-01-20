import { useState } from "react";

import { ExternalApi } from "~/api";
import { useAsyncEffect } from "~/hooks";

export const useCurrentLocation = (defaultValue?: { lat: number, lng: number})  => {
	const [coords, setCoords] = useState(defaultValue);
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