import { Circle, Marker, Polygon } from '@react-google-maps/api';

import { type IMapItem, type IMapItemProps } from './map-item.types';

const circlesOptions = {
    fillOpacity: 0.3,
    fillColor: '#FFFF00',
    strokeColor: '#FFFF00',
    strokeWeight: 2,
    draggable: false,
    editable: false,
    clickable: false,
};

const polygonsOptions = {
    fillOpacity: 0.3,
    fillColor: '#FFFF00',
    strokeColor: '#FFFF00',
    strokeWeight: 2,
    draggable: false,
    editable: false,
    clickable: false,
};

const markerOptions = {
    opacity: 0.5,
};

export function MapItem<T extends IMapItem>({ item, onClick }: IMapItemProps<T>) {
    const { polygon, line, marker, circle } = item?.data ?? {};

    const _onClick = () => {
        onClick?.(item);
    };

    return (
        <>
            {!!circle && (
                <Circle
                    onClick={onClick ? _onClick : undefined}
                    options={circlesOptions}
                    radius={circle?.radius ?? 0}
                    center={circle?.center ?? { lat: 0, lng: 0 }}
                />
            )}
            {!!polygon && <Polygon onClick={onClick ? _onClick : undefined} options={polygonsOptions} path={polygon?.points} />}
            {!!line && <Polygon onClick={onClick ? _onClick : undefined} options={polygonsOptions} path={line?.points} />}
            {!!marker && <Marker onClick={onClick ? _onClick : undefined} options={markerOptions} position={marker} />}
        </>
    );
}
