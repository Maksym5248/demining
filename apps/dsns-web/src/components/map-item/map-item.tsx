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

const selectedOptions = {
    fillColor: '#3399ff',
    strokeColor: '#3399ff',
};

export function MapItem<T extends IMapItem>({ item, onClick, isSelected, isClickable = false }: IMapItemProps<T>) {
    const { polygon, line, marker, circle } = item?.data ?? {};

    const _onClick = () => {
        onClick?.(item);
    };

    return (
        <>
            {!!circle && (
                <Circle
                    onClick={onClick ? _onClick : undefined}
                    options={{ ...circlesOptions, ...(isSelected ? selectedOptions : {}), clickable: isClickable }}
                    radius={circle?.radius ?? 0}
                    center={circle?.center ?? { lat: 0, lng: 0 }}
                />
            )}
            {!!polygon && (
                <Polygon
                    onClick={onClick ? _onClick : undefined}
                    options={{ ...polygonsOptions, ...(isSelected ? selectedOptions : {}), clickable: isClickable }}
                    path={polygon?.points}
                />
            )}
            {!!line && (
                <Polygon
                    onClick={onClick ? _onClick : undefined}
                    options={{ ...polygonsOptions, ...(isSelected ? selectedOptions : {}), clickable: isClickable }}
                    path={line?.points}
                />
            )}
            {!!marker && (
                <Marker
                    onClick={onClick ? _onClick : undefined}
                    position={marker}
                    clickable={isClickable}
                    icon={
                        isSelected
                            ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                            : 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                    }
                />
            )}
        </>
    );
}
