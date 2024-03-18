import { Form } from "antd";

import { MapView } from "~/components"
import { useStore } from "~/hooks";
import { MAP_SIZE, MAP_VIEW_TAKE_PRINT_CONTAINER, WIZARD_MODE } from "~/constants";
import { IExplosiveObjectActionDTOParams, ExternalApi } from "~/api";
import { IMapViewActionValue } from "~/stores";
import { mathUtils } from "~/utils/math";

const mapContainerStyle = {
	width: MAP_SIZE.MEDIUM_WIDTH,
	height: MAP_SIZE.MEDIUM_HEIGHT,
};

interface Props {
	mode: WIZARD_MODE
  }

  
export function Map({ mode }: Props){
	const { explosiveObject } = useStore();

	const validateMapView = (_:any, value: IMapViewActionValue) => {
		if (!value.marker || !value.zoom) {
			return Promise.reject(new Error('Є обов\'язковим полем'));
		}

		return Promise.resolve();
	};
	
	return (
		<div id={MAP_VIEW_TAKE_PRINT_CONTAINER}>
			<Form.Item
				name="mapView"
				rules={[ { validator: validateMapView }]}
			>
				<Form.Item noStyle shouldUpdate={() => true} >
					{({ getFieldValue, setFieldValue }) => {
						const explosiveObjectActions = getFieldValue("explosiveObjectActions") as IExplosiveObjectActionDTOParams[];
						const executedAt = getFieldValue("executedAt");
						const mapView = getFieldValue("mapView") as IMapViewActionValue;

						return (
							<MapView
								type={mode === WIZARD_MODE.VIEW  ? "picture": "edit"}
								initialCircle={mapView?.circle ?? undefined}
								initialMarker={mapView?.marker ?? undefined}
								initialZoom={mapView?.zoom}
						 		mapContainerStyle={mapContainerStyle}
								date={executedAt}
								explosiveObjects={explosiveObjectActions.map(el => {
									const item = explosiveObject.collectionActions.get(el?.id ?? "")  || explosiveObject.collection.get(el.explosiveObjectId);
									
									return `${item.fullDisplayName} ${el.quantity} од.`
								})}
								onChange={async (value) => {
									setFieldValue("mapView", {
										marker: {
											lat: mathUtils.toFixed(value.marker?.lat, 9),
											lng: mathUtils.toFixed(value.marker?.lng, 9),
										},
										circle: value.circle ? {
											center:  {
												lat: mathUtils.toFixed(value.circle?.center.lat, 9),
											 	lng: mathUtils.toFixed(value.circle?.center.lng, 9)
											},
											radius: mathUtils.toFixed(value.circle?.radius, 9),
										} : undefined,
										zoom: mathUtils.toFixed(value.zoom, 9)
									});

									if(value?.marker){
										const address = await ExternalApi.getGeocode(value.marker);
										setFieldValue("address", address);
									}
								}}
							/>
						)
					}}
				</Form.Item>
			</Form.Item>
		</div>
	)
}