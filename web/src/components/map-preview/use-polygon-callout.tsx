import { useMemo } from 'react';

import { IPolygon } from '~/types';
import { mapUtils } from '~/utils';

interface IUsePolygonCalloutParams {
    polygon?: IPolygon;
    zoom: number;
    isVisibleMap: boolean;
    offset: number; // px
}

export function usePolygonCallout({ polygon, zoom, isVisibleMap, offset }: IUsePolygonCalloutParams) {
    const center = useMemo(() => (polygon ? mapUtils.getCenter(polygon) : null), [polygon]);

    const callout = useMemo(() => {
        if (!polygon?.points.length || !center) return [];

        const offsetInMeters = mapUtils.pixelsToMeters(offset, zoom);
        return mapUtils.polygonCallout(polygon, offsetInMeters);
    }, [polygon, center, offset, zoom, isVisibleMap]);

    return callout;
}
