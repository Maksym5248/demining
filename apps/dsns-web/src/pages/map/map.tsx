import { useEffect, useState } from 'react';

import { FloatButton } from 'antd';
import { observer } from 'mobx-react-lite';
import { useValues, type ICircle, type ILine, type IPolygon } from 'shared-my-client';

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

    const onChange = (value: IOnChangeMapView) => {
        values.set('value', value);
    };

    const onOpenMissionReport = async () => {
        Modal.show(MODALS.MISSION_REPORT_WIZARD, { mode: WIZARD_MODE.CREATE, initialMap: values.get('value') });
    };

    const onChangeEditing = (value: boolean) => {
        setCreating(value);
    };

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
                polygons={store.map.list.asArray.map((el) => el.data.polygon as IPolygon).filter((el) => !!el)}
                circles={store.map.list.asArray.map((el) => el.data.circle as ICircle).filter((el) => !!el)}
                lines={store.map.list.asArray.map((el) => el.data.line as ILine).filter((el) => !!el)}
                initialIsActiveStick
                initialIsVisibleInArea
            />
            {isCreating && (
                <FloatButton shape="square" style={{ bottom: 150, right: 60 }} icon={<Icon.PlusOutlined />} onClick={onOpenMissionReport} />
            )}
        </div>
    );
});
