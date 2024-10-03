import { memo } from 'react';

import { Circle, Polygon } from '@react-google-maps/api';

import { type IMapFiguresProps } from './map.types';

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

function Component({ circles, polygons, lines, isVisibleInArea = false }: IMapFiguresProps) {
    return (
        <>
            {isVisibleInArea &&
                !!circles?.length &&
                circles.map((item, index) => (
                    <Circle key={index} options={circlesOptions} radius={item?.radius ?? 0} center={item?.center ?? { lat: 0, lng: 0 }} />
                ))}
            {isVisibleInArea &&
                !!polygons?.length &&
                polygons.map((item, index) => <Polygon key={index} options={polygonsOptions} path={item?.points} />)}
            {isVisibleInArea &&
                !!lines?.length &&
                lines.map((item, index) => <Polygon key={index} options={polygonsOptions} path={item?.points} />)}
        </>
    );
}

export const MapFigures = memo(Component);
