import { Form } from "antd";

import { MapView } from "~/components"
import { useStore } from "~/hooks";
import { MAP_SIZE } from "~/constants";

import { IExplosiveObjectActionListItem } from "../explosive-object-action";

const mapContainerStyle = {
	width: MAP_SIZE.MEDIUM_WIDTH,
	height: MAP_SIZE.MEDIUM_HEIGHT,
};

export function Map(){
	const { explosiveObject } = useStore();

	return (
		<Form.Item noStyle shouldUpdate={() => true} >
			{({ getFieldValue, setFieldValue }) => {
				const explosiveObjectActions = getFieldValue("explosiveObjectActions") as IExplosiveObjectActionListItem[];
				const executedAt = getFieldValue("executedAt");
				const mapView = getFieldValue("mapView");

				return (
					<MapView
						initialCircle={mapView?.circle}
						initialMarker={mapView?.marker}
						initialZoom={mapView?.zoom}
						 	mapContainerStyle={mapContainerStyle}
						date={executedAt}
						explosiveObjects={explosiveObjectActions.map(el => {
							const item = explosiveObject.collection.get(el.explosiveObjectId);
							return `${item.fullDisplayName} ${el.quantity} од.`
						})}
						onChange={(value) => setFieldValue("mapView", value)}
					/>
				)
			}}

		</Form.Item>
		
	)
}