import { useMemo } from 'react';

import { ILine } from '~/types';
import { mapUtils } from '~/utils';

interface IUsePolygonCalloutParams {
    line?: ILine;
    zoom: number;
    isVisibleMap: boolean;
    offset: number; // px
}

export function useLineCallout({ line, zoom, isVisibleMap, offset }: IUsePolygonCalloutParams) {
    const center = useMemo(() => (line ? mapUtils.getCenter(line) : null), [line]);

    const callout = useMemo(() => {
        if (!line?.points.length || !center) return [];

        const offsetInMeters = mapUtils.pixelsToMeters(offset, zoom);
        return mapUtils.lineCallout(line, offsetInMeters);
    }, [line, center, offset, zoom, isVisibleMap]);

    return callout;
}
