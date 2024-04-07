import { Form } from "antd";

import { MapPreview } from "~/components"
import { useStore } from "~/hooks";
import { MAP_SIZE, MAP_VIEW_TAKE_PRINT_CONTAINER, MODALS } from "~/constants";
import { IExplosiveObjectActionDTOParams, ExternalApi } from "~/api";
import { IMapViewActionValue } from "~/stores";
import { Modal } from "~/services";
import { IMapEditorSubmit } from "~/modals/map-editor/map-editor.types";

import { s, MAP_PADDING_TOP, MAP_PADDING_BOTTOM } from "./map.styles";

const mapContainerStyle = {
	width: MAP_SIZE.MEDIUM_WIDTH,
	height: MAP_SIZE.MEDIUM_HEIGHT + MAP_PADDING_TOP + MAP_PADDING_BOTTOM,
	marginTop: -MAP_PADDING_TOP,
};

export function Map({ isEdit = false}: { isEdit?: boolean } ){
	const { explosiveObject } = useStore();

	const validateMapView = (_:any, value: IMapViewActionValue) => {
		if (!value.marker || !value.zoom) {
			return Promise.reject(new Error('Є обов\'язковим полем'));
		}

		return Promise.resolve();
	};
	
	return (
		<div id={MAP_VIEW_TAKE_PRINT_CONTAINER} css={s.container}>
			<Form.Item
				name="mapView"
				rules={[ { validator: validateMapView }]}
			>
				<Form.Item noStyle shouldUpdate={() => true} >
					{({ getFieldValue, setFieldValue }) => {
						const explosiveObjectActions = getFieldValue("explosiveObjectActions") as IExplosiveObjectActionDTOParams[];
						const executedAt = getFieldValue("executedAt");
						const mapView = getFieldValue("mapView") as IMapViewActionValue;

						const onSubmit = async ({ area, ...value}: IMapEditorSubmit) => {
							setFieldValue("mapView", value);

							if(area) {
								setFieldValue("checkedTerritory", area);
							}
			
							if(!value?.marker) return;
							const address = await ExternalApi.getGeocode(value.marker);
							setFieldValue("address", address);
						};

						const onEdit = async () => {
							Modal.show(MODALS.MAP_EDITOR, {
								initialCircle: mapView?.circle,
								initialMarker: mapView?.marker,
								initialPolygon: mapView?.polygon,
								initialZoom: mapView?.zoom,
								id: mapView?.id,
								onSubmit
							})
						
						};

						const explosiveObjects = explosiveObjectActions.map(el => {
							const item = explosiveObject.collectionActions.get(el?.id ?? "")  || explosiveObject.collection.get(el.explosiveObjectId);
							return `${item?.fullDisplayName} ${el.quantity} од.`;
						})

						return (
							<MapPreview
								circle={mapView?.circle}
								marker={mapView?.marker}
								polygon={mapView?.polygon}
								zoom={mapView?.zoom}
								explosiveObjects={explosiveObjects}
								date={executedAt}
								isEdit={isEdit}
								onEdit={onEdit}
								mapContainerStyle={mapContainerStyle}
							/>
						)
					}}
				</Form.Item>
			</Form.Item>
		</div>
	)
}