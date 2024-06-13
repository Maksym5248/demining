import { useState } from 'react';

import { ExternalApi } from '~/api';
import { useAsyncEffect } from '~/hooks';
import { IPoint } from '~/types';

export const useCurrentLocation = (defaultValue?: IPoint) => {
    const [coords, setCoords] = useState<IPoint | undefined>(defaultValue);
    const [isLoading, setLoading] = useState(true);

    useAsyncEffect(async () => {
        try {
            const location = await ExternalApi.getLocation();

            setCoords({
                lat: location.lat,
                lng: location.lon,
            });
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    }, []);

    return {
        isLoading,
        coords,
    };
};
