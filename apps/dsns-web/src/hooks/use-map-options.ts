import { useState } from 'react';

import { DrawingType } from '~/components';

export const useMapOptions = ({
    isPictureType,
    isCreating,
    drawing,
}: {
    isPictureType: boolean;
    isCreating?: boolean;
    drawing?: DrawingType;
}) => {
    const [mapTypeId, setMapTypeId] = useState<google.maps.MapTypeId>(google.maps.MapTypeId.SATELLITE);

    const mapOptions = {
        streetViewControl: false,
        scaleControl: false,
        zoomControl: false,
        fullscreenControl: false,
        mapTypeId,
        mapTypeControl: false,
        disableDoubleClickZoom: !isPictureType,
        draggable: !isPictureType,
        isFractionalZoomEnabled: !isPictureType,
        mapTypeControlOptions: {
            style: window?.google?.maps?.MapTypeControlStyle?.DROPDOWN_MENU,
        },
    };

    const circleOptions = {
        fillOpacity: 0.3,
        fillColor: '#ff0000',
        strokeColor: '#ff0000',
        strokeWeight: 2,
        draggable: !isPictureType && drawing !== DrawingType.MOVE && drawing !== DrawingType.MARKER,
        editable: !isPictureType && drawing !== DrawingType.MOVE && drawing !== DrawingType.MARKER,
        clickable: !isPictureType && !isCreating && drawing !== DrawingType.MOVE && drawing !== DrawingType.MARKER,
    };

    const polygonOptions = {
        fillOpacity: 0.3,
        fillColor: '#ff0000',
        strokeColor: '#ff0000',
        strokeWeight: 2,
        draggable: !isPictureType && drawing !== DrawingType.MOVE && drawing !== DrawingType.MARKER,
        editable: !isPictureType && drawing !== DrawingType.MOVE && drawing !== DrawingType.MARKER,
        clickable: !isPictureType && !isCreating && drawing !== DrawingType.MOVE && drawing !== DrawingType.MARKER,
    };

    const gridOptions = {
        fillOpacity: 0,
        strokeColor: '#A0A0A0',
        strokeWeight: 1,
        draggable: false,
        editable: false,
        clickable: false,
    };

    const polylineOptions = {
        fillOpacity: 0.3,
        fillColor: '#fff',
        strokeColor: '#fff',
        strokeWeight: 2,
    };

    const lineOptions = {
        fillOpacity: 0,
        fillColor: '#ff0000',
        strokeColor: '#ff0000',
        strokeWeight: 2,
        draggable: !isPictureType && drawing !== DrawingType.MOVE && drawing !== DrawingType.MARKER,
        editable: !isPictureType && drawing !== DrawingType.MOVE && drawing !== DrawingType.MARKER,
    };

    const linePolygonOptions = {
        fillOpacity: 0.3,
        fillColor: '#A0A0A0',
        strokeColor: '#A0A0A0',
        strokeWeight: 2,
        draggable: false,
        editable: false,
        clickable: false,
    };

    const createPolygonOptions = {
        fillOpacity: 0,
        fillColor: '#ff0000',
        strokeColor: '#ff0000',
        strokeWeight: 2,
        draggable: true,
        editable: true,
    };

    const toggleMapType = () => {
        setMapTypeId((prev) => (prev === google.maps.MapTypeId.HYBRID ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.HYBRID));
    };

    return {
        mapOptions,
        polygonOptions,
        circleOptions,
        lineOptions,
        polylineOptions,
        createPolygonOptions,
        gridOptions,
        toggleMapType,
        linePolygonOptions,
    };
};
