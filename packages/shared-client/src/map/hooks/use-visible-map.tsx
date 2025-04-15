import { type RefObject, useEffect, useRef, useState } from 'react';

interface IUseVisibleMapParams {
    mapRef?: RefObject<google.maps.Map | null>;
}

export function useVisibleMap({ mapRef }: IUseVisibleMapParams) {
    const interval = useRef<NodeJS.Timeout>(null);

    const [isVisibleMap, setVisibleMap] = useState(false);

    useEffect(() => {
        interval.current = setInterval(() => {
            if (mapRef?.current && mapRef.current.getProjection()) {
                setVisibleMap(true);
                if (interval.current) {
                    clearInterval(interval.current);
                    interval.current = null;
                }
            }
        }, 100);

        return () => {
            if (interval.current) {
                clearInterval(interval.current);
            }
        };
    }, []);

    return isVisibleMap;
}
