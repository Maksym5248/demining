import { Form } from "antd";

import { MapView } from "~/components"
import { useStore } from "~/hooks";
import { MAP_SIZE } from "~/constants";
import { IExplosiveObjectActionDTOParams, ExternalApi } from "~/api";
import { IMapViewActionValue } from "~/stores";

const mapContainerStyle = {
	width: MAP_SIZE.MEDIUM_WIDTH,
	height: MAP_SIZE.MEDIUM_HEIGHT,
};

export function Map(){
	const { explosiveObject } = useStore();

	const validateMapView = (_:any, value: IMapViewActionValue) => {
		if (!value.markerLat || !value.markerLng || !value.zoom) {
			return Promise.reject(new Error('Є обов\'язковим полем'));
		}

		return Promise.resolve();
	};
	
	return (
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
									markerLat: Number(value.marker?.lat?.toFixed(9)),
									markerLng: Number(value.marker?.lng?.toFixed(9)),
									circleCenterLat: Number(value.circle?.center.lat?.toFixed(9)),
									circleCenterLng: Number(value.circle?.center.lng?.toFixed(9)),
									circleRadius: Number(value.circle?.radius),
									zoom: Number(value.zoom.toFixed(9))
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
	)
}