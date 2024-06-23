import { useMemo } from 'react';

import { mapUtils } from 'shared-my-client/map';
import { type IPolygon } from 'shared-my-client/map';

interface IUsePolygonCalloutParams {
    polygon?: IPolygon;
    zoom: number;
    isVisibleMap: boolean;
    offset: number; // px
}

export function usePolygonCallout({ polygon, zoom, isVisibleMap, offset }: IUsePolygonCalloutParams) {
    const center = useMemo(() => (polygon ? mapUtils.getCenter({ polygon }) : null), [polygon]);

    const callout = useMemo(() => {
        if (!polygon?.points.length || !center) return [];

        const offsetInMeters = mapUtils.pixelsToMeters(offset, zoom);
        return mapUtils.polygonCallout(polygon, offsetInMeters);
    }, [polygon, center, offset, zoom, isVisibleMap]);

    return callout;
}
