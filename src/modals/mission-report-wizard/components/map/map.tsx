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
		if (!value.markerLat || !value.markerLng || !value.zoom) {
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

						const isCircle = mapView?.circleCenterLat && mapView?.circleCenterLng && mapView?.circleRadius;
						const isMarker = mapView?.markerLat && mapView?.markerLng;

						return (
							<MapView
								type={mode === WIZARD_MODE.VIEW  ? "picture": "edit"}
								initialCircle={isCircle ? {
									center: {
										lat: mapView?.circleCenterLat,
										lng: mapView?.circleCenterLng,
									},
									radius: mapView?.circleRadius
								}: undefined}
								initialMarker={isMarker ? {
									lat: mapView?.markerLat,
									lng: mapView?.markerLng,
								}: undefined}
								initialZoom={mapView?.zoom}
						 	mapContainerStyle={mapContainerStyle}
								date={executedAt}
								explosiveObjects={explosiveObjectActions.map(el => {
									const item = explosiveObject.collection.get(el.explosiveObjectId);
									return `${item.fullDisplayName} ${el.quantity} од.`
								})}
								onChange={async (value) => {
									setFieldValue("mapView", {
										markerLat: mathUtils.toFixed(value.marker?.lat, 9),
										markerLng:  mathUtils.toFixed(value.marker?.lng, 9),
										circleCenterLat:  mathUtils.toFixed(value.circle?.center.lat, 9),
										circleCenterLng:  mathUtils.toFixed(value.circle?.center.lng, 9),
										circleRadius:  mathUtils.toFixed(value.circle?.radius, 9),
										zoom:  mathUtils.toFixed(value.zoom, 9)
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