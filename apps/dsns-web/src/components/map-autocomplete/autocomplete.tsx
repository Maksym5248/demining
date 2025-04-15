import { useRef } from 'react';

import { Autocomplete as AutocompleteGoogle } from '@react-google-maps/api';
import { Input } from 'antd';
import { mapUtils, type IPoint } from 'shared-my-client';

import { s } from './autocomplete.style';

interface IAutocompleteProps {
    onPlaceChanged: (value: { point: IPoint }) => void;
}

export function Autocomplete({ onPlaceChanged }: IAutocompleteProps) {
    const autocompleteRef = useRef<google.maps.places.Autocomplete>(null);

    const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onChanged = () => {
        const place = autocompleteRef?.current?.getPlace();

        let point;

        // Check if the input is a pair of coordinates
        const coordinates = place?.name?.match(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/);
        if (coordinates) {
            // Parse the coordinates and create a LatLngLiteral object
            const [lat, lng] = place?.name?.split(',').map(Number) ?? [0, 0];
            point = { lat, lng };
        } else if (place?.geometry?.location) {
            // If the input is not a pair of coordinates, get the location from the place's geometry
            point = mapUtils.createPointLiteral(place.geometry.location);
        }

        if (!point) {
            return;
        }

        onPlaceChanged?.({ point });
    };

    return (
        <AutocompleteGoogle onLoad={onLoadAutocomplete} onPlaceChanged={onChanged}>
            <Input type="text" size="large" placeholder="Lat, Lng" css={s.autocomplete} />
        </AutocompleteGoogle>
    );
}
