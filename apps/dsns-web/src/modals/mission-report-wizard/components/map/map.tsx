import { Form } from 'antd';
import { str } from 'shared-my/common';
import { type IExplosiveObjectActionDTOParams } from 'shared-my-client/api';
import { type IMapViewActionValue } from 'shared-my-client/stores';

import { ExternalApi } from '~/api';
import { MapPreview } from '~/components';
import { MAP_SIZE, MAP_VIEW_TAKE_PRINT_CONTAINER, MODALS } from '~/constants';
import { useStore } from '~/hooks';
import { type IMapEditorSubmit } from '~/modals/map-editor/map-editor.types';
import { Modal } from '~/services';

import { s, MAP_PADDING_TOP, MAP_PADDING_BOTTOM } from './map.styles';

const mapContainerStyle = {
    width: MAP_SIZE.MEDIUM_WIDTH,
    height: MAP_SIZE.MEDIUM_HEIGHT + MAP_PADDING_TOP + MAP_PADDING_BOTTOM,
    marginTop: -MAP_PADDING_TOP,
};

export function Map({ isEdit = false }: { isEdit?: boolean }) {
    const { explosiveObject } = useStore();

    const validateMapView = (_: any, value: IMapViewActionValue) => {
        if (!value.marker || !value.zoom) {
            return Promise.reject(new Error("Є обов'язковим полем"));
        }

        return Promise.resolve();
    };

    return (
        <div id={MAP_VIEW_TAKE_PRINT_CONTAINER} css={s.container}>
            <Form.Item name="addressDetails" />
            <Form.Item name="mapView" rules={[{ validator: validateMapView }]}>
                <Form.Item noStyle shouldUpdate={() => true}>
                    {({ getFieldValue, setFieldValue }) => {
                        const explosiveObjectActions = getFieldValue('explosiveObjectActions') as IExplosiveObjectActionDTOParams[];
                        const executedAt = getFieldValue('executedAt');
                        const addressDetails = getFieldValue('addressDetails');
                        const mapView = getFieldValue('mapView') as IMapViewActionValue;

                        const onSubmit = async ({ area, ...value }: IMapEditorSubmit) => {
                            setFieldValue('mapView', { ...value });

                            if (area) {
                                setFieldValue('checkedTerritory', area);
                            }

                            if (value?.marker) {
                                const address = await ExternalApi.getGeocode(value.marker);
                                setFieldValue('address', str.toAddressString(address));
                                setFieldValue('addressDetails', address);
                            }
                        };

                        const onEdit = async () => {
                            Modal.show(MODALS.MAP_EDITOR, {
                                initialCircle: mapView?.circle,
                                initialMarker: mapView?.marker,
                                initialPolygon: mapView?.polygon,
                                initialLine: mapView?.line,
                                initialZoom: mapView?.zoom,
                                id: mapView?.id,
                                onSubmit,
                            });
                        };

                        const onChange = ({ zoom }: { zoom: number }) => {
                            setFieldValue('mapView', {
                                ...(mapView || {}),
                                zoom,
                            });
                        };

                        const explosiveObjects: Record<string, number> = {};

                        explosiveObjectActions.forEach((el) => {
                            const item =
                                explosiveObject.collectionActions.get(el?.id ?? '')?.explosiveObject ||
                                explosiveObject.collection.get(el.explosiveObjectId);
                            const name = item?.fullDisplayName as string;

                            if (explosiveObjects[name]) {
                                explosiveObjects[name] += el.quantity;
                            } else {
                                explosiveObjects[name] = el.quantity;
                            }
                        });

                        return (
                            <MapPreview
                                circle={mapView?.circle}
                                marker={mapView?.marker}
                                polygon={mapView?.polygon}
                                line={mapView?.line}
                                initialZoom={mapView?.zoom}
                                onChange={onChange}
                                explosiveObjects={Object.keys(explosiveObjects).map((key) => `${key} - ${explosiveObjects[key]}`)}
                                date={executedAt}
                                isEdit={isEdit}
                                onEdit={onEdit}
                                mapContainerStyle={mapContainerStyle}
                                city={addressDetails?.city}
                            />
                        );
                    }}
                </Form.Item>
            </Form.Item>
        </div>
    );
}
