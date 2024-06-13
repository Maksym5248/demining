import { useLoadScript, type Libraries } from '@react-google-maps/api';
import { Spin } from 'antd';

import { CONFIG } from '~/config';
import { DEFAULT_CENTER } from '~/constants';
import { useCurrentLocation } from '~/hooks';
import { Theme } from '~/styles';

const libraries: Libraries = ['places', 'drawing', 'geometry'];

const containerLoading = Theme.css(`
	display: flex;
	flex: 1;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
`);

export function withMapProvider<T>(WrappedComponent: React.ComponentType<T>) {
    return function MapProvider(props: T) {
        const { isLoaded, loadError } = useLoadScript({
            googleMapsApiKey: CONFIG.GOOGLE_API_KEY,
            language: 'uk',
            libraries,
        });

        const position = useCurrentLocation(DEFAULT_CENTER);

        if (loadError) {
            return <div>Error loading maps</div>;
        }

        if (!isLoaded || position.isLoading) {
            return (
                <div css={containerLoading}>
                    <Spin />
                </div>
            );
        }

        return <WrappedComponent position={position.coords} {...props} />;
    };
}
