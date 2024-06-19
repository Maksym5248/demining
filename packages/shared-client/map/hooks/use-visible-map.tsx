import { type MutableRefObject, useEffect, useRef, useState } from 'react';

interface IUseVisibleMapParams {
    mapRef?: MutableRefObject<google.maps.Map | undefined>;
}

export function useVisibleMap({ mapRef }: IUseVisibleMapParams) {
    const interval = useRef<NodeJS.Timeout>();

    const [isVisibleMap, setVisibleMap] = useState(false);

    useEffect(() => {
        interval.current = setInterval(() => {
            if (mapRef?.current && mapRef.current.getProjection()) {
                setVisibleMap(true);
                clearInterval(interval.current);
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
