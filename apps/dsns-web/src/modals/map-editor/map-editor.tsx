import { useState } from 'react';

import { Modal } from 'antd';
import { observer } from 'mobx-react-lite';

import { IOnChangeMapView, MapView } from '~/components';
import { useDebounce, useStore, useValues } from '~/hooks';
import { ICircle, IGeoBox, ILine, IPolygon } from '~/types';

import { MapEditorModalProps } from './map-editor.types';

const mapContainerStyle = {
    height: '75vh',
};

export const MapEditorModal = observer(
    ({
        initialCircle,
        initialMarker,
        initialPolygon,
        initialLine,
        initialZoom,
        initialArea,
        id,
        isVisible,
        onSubmit,
        hide,
    }: MapEditorModalProps) => {
        const store = useStore();

        const values = useValues<IOnChangeMapView>({
            value: {
                circle: initialCircle,
                marker: initialMarker,
                polygon: initialPolygon,
                line: initialLine,
                zoom: initialZoom,
                area: initialArea,
            },
        });

        const [isLoadingAllInGeoBox, setLoadingAllInGeoBox] = useState(false);

        const onCancel = () => {
            hide();
        };

        const onChange = (value: IOnChangeMapView) => {
            values.set('value', value);
        };

        const onSave = () => {
            onSubmit?.(values.get('value'));
            hide();
        };

        const fetchAllInGeoBox = useDebounce(
            (box: IGeoBox) => {
                store.map.fetchAllInGeoBox.run(box);
                setLoadingAllInGeoBox(false);
            },
            [],
            1000,
        );

        const minZoomLoadArea = 16;

        const onChangeGeobox = (value: { box: IGeoBox; zoom: number }) => {
            if (value.zoom < minZoomLoadArea) return;
            setLoadingAllInGeoBox(true);
            fetchAllInGeoBox(value.box);
        };

        return (
            <Modal centered afterClose={hide} title="Карта" open={isVisible} width="80%" onOk={onSave} onCancel={onCancel}>
                <MapView
                    initialCircle={initialCircle}
                    initialMarker={initialMarker}
                    initialPolygon={initialPolygon}
                    initialLine={initialLine}
                    initialZoom={initialZoom}
                    mapContainerStyle={mapContainerStyle}
                    onChange={onChange}
                    onChangeGeobox={onChangeGeobox}
                    polygons={store.map.list.asArray.filter((el) => el.id !== id && !!el.polygon).map((el) => el.polygon as IPolygon)}
                    circles={store.map.list.asArray.filter((el) => el.id !== id && !!el.circle).map((el) => el.circle as ICircle)}
                    lines={store.map.list.asArray.filter((el) => el.id !== id && !!el.line).map((el) => el.line as ILine)}
                    isLoadingVisibleInArea={store.map.fetchAllInGeoBox.isLoading || isLoadingAllInGeoBox}
                    minZoomLoadArea={minZoomLoadArea}
                />
            </Modal>
        );
    },
);
