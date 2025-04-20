import { memo, useCallback, useEffect, useState } from 'react';

import { FloatButton } from 'antd';
import { observer } from 'mobx-react-lite';
import { type IMapViewAction, useValues } from 'shared-my-client';

import { Icon, type IMapItem, type IMapItemProps, type IOnChangeMapView, MapItem, MapView } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore } from '~/hooks';
import { HEADER_HEIGHT } from '~/routes/layout/layout.styles';
import { Modal } from '~/services';

import { MapViewCard } from './components';
import { s } from './map.style';

const mapContainerStyle = {
    height: `calc(100vh - ${HEADER_HEIGHT}px + 22px)`,
};

const MapItemMemo = memo(MapItem) as <T extends IMapItem>(props: IMapItemProps<T>) => JSX.Element;

export const MapPage = observer(() => {
    const store = useStore();
    const [isCreating, setCreating] = useState(false);
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

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
        Modal.show(MODALS.MISSION_REPORT_WIZARD, {
            mode: WIZARD_MODE.CREATE,
            initialMap: values.get('value'),
        });
    }, []);

    const onChangeEditing = useCallback((value: boolean) => {
        setCreating(value);
    }, []);

    useEffect(() => {
        if (!store.map.isLoaded) {
            store.map.fetchAll.run();
        }
    }, []);

    const onClick = useCallback((item: IMapViewAction) => {
        setSelectedId(item?.id);
        store.missionReport.fetchItem.run(item.data.documentId);
    }, []);

    const renderMapItem = useCallback(
        (item: IMapViewAction) => {
            return <MapItemMemo item={item} onClick={onClick} isSelected={selectedId === item.id} isClickable />;
        },
        [selectedId],
    );

    const onClose = useCallback(() => {
        setSelectedId(undefined);
    }, []);

    const selectedItem = store.map.collection.get(selectedId);

    return (
        <div css={s.container}>
            <MapView
                mapContainerStyle={mapContainerStyle}
                onChange={onChange}
                onChangeEditing={onChangeEditing}
                items={store.map.list.asArray}
                initialIsActiveStick
                initialIsVisibleInArea
                minZoomLoadArea={1}
                renderMapItem={renderMapItem}
                selectedItem={selectedItem}
                css={s.map}
            />
            {isCreating && (
                <FloatButton shape="square" style={{ bottom: 120, right: 10 }} icon={<Icon.PlusOutlined />} onClick={onOpenMissionReport} />
            )}
            {!!selectedId && <MapViewCard selectedId={selectedId} onClose={onClose} />}
        </div>
    );
});
