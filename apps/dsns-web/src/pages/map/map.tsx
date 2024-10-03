import { useCallback, useEffect, useState } from 'react';

import { FloatButton } from 'antd';
import { observer } from 'mobx-react-lite';
import { useValues } from 'shared-my-client';

import { Icon, type IOnChangeMapView, MapView } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore } from '~/hooks';
import { Modal } from '~/services';

import { s } from './map.style';

const mapContainerStyle = {
    height: '80vh',
};

export const MapPage = observer(() => {
    const store = useStore();
    const [isCreating, setCreating] = useState(false);
    const values = useValues<IOnChangeMapView>({
        value: {
            circle: undefined,
            marker: undefined,
            polygon: undefined,
            line: undefined,
            zoom: 0,
            area: undefined,
        },
    });

    const onChange = useCallback((value: IOnChangeMapView) => {
        values.set('value', value);
    }, []);

    const onOpenMissionReport = useCallback(async () => {
        Modal.show(MODALS.MISSION_REPORT_WIZARD, { mode: WIZARD_MODE.CREATE, initialMap: values.get('value') });
    }, []);

    const onChangeEditing = useCallback((value: boolean) => {
        setCreating(value);
    }, []);

    useEffect(() => {
        if (!store.map.isLoaded) {
            store.map.fetchAll.run();
        }
    }, []);

    return (
        <div css={s.container}>
            <MapView
                mapContainerStyle={mapContainerStyle}
                onChange={onChange}
                onChangeEditing={onChangeEditing}
                polygons={store.map.polygons}
                circles={store.map.circles}
                lines={store.map.lines}
                initialIsActiveStick
                initialIsVisibleInArea
                minZoomLoadArea={1}
            />
            {isCreating && (
                <FloatButton shape="square" style={{ bottom: 150, right: 60 }} icon={<Icon.PlusOutlined />} onClick={onOpenMissionReport} />
            )}
        </div>
    );
});
