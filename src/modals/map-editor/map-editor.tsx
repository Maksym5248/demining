import { useState } from 'react';

import { Modal } from 'antd';
import { observer } from 'mobx-react-lite'

import { IOnChangeMapView, MapView } from '~/components';
import { mathUtils } from '~/utils';

import { MapEditorModalProps } from './map-editor.types';

const mapContainerStyle = {
	height: '75vh',
}

export const MapEditorModal  = observer(({
	initialCircle,
	initialMarker,
	initialPolygon,
	initialZoom,
	onSubmit,
	isVisible,
	hide
}: MapEditorModalProps) => {
	const [circle, setCircle] = useState(initialCircle);
	const [marker, setMarker] = useState(initialMarker);
	const [polygon, setPolygon] = useState(initialPolygon);
	const [zoom, setZoom] = useState(initialZoom);

	const onCancel = () => {
		hide();
	};

	const onChange = (value:IOnChangeMapView) => {
		setCircle(value.circle);
		setMarker(value.marker);
		setPolygon(value.polygon);
		setZoom(value.zoom);
	}

	const onSave = () => {
		console.log("sd", {
			marker: {
				lat: mathUtils.toFixed(marker?.lat, 9),
				lng: mathUtils.toFixed(marker?.lng, 9),
			},
			polygon: polygon ? {
				points: polygon.points.map(el => ({
					lat: mathUtils.toFixed(el.lat, 9),
					lng: mathUtils.toFixed(el.lng, 9),
				}))
			} : undefined,
			circle: circle ? {
				center:  {
					lat: mathUtils.toFixed(circle?.center.lat, 9),
					lng: mathUtils.toFixed(circle?.center.lng, 9)
				},
				radius: mathUtils.toFixed(circle?.radius, 9),
			} : undefined,
			zoom: mathUtils.toFixed(zoom, 9)
		});
		onSubmit?.({
			marker: {
				lat: mathUtils.toFixed(marker?.lat, 9),
				lng: mathUtils.toFixed(marker?.lng, 9),
			},
			polygon: polygon ? {
				points: polygon.points.map(el => ({
					lat: mathUtils.toFixed(el.lat, 9),
					lng: mathUtils.toFixed(el.lng, 9),
				}))
			} : undefined,
			circle: circle ? {
				center:  {
					lat: mathUtils.toFixed(circle?.center.lat, 9),
					lng: mathUtils.toFixed(circle?.center.lng, 9)
				},
				radius: mathUtils.toFixed(circle?.radius, 9),
			} : undefined,
			zoom: mathUtils.toFixed(zoom, 9)
		});
		hide();
	}
		
	return (   
		<Modal 
			centered
			afterClose={hide}
			title="Карта"
			open={isVisible}
			width="80%"
			onOk={onSave}
			onCancel={onCancel}
		>
			<MapView
				type="edit"
				initialCircle={initialCircle}
				initialMarker={initialMarker}
				initialPolygon={initialPolygon}
				initialZoom={initialZoom}
				mapContainerStyle={mapContainerStyle}
				onChange={onChange}
			/>
		</Modal>
	);
});

