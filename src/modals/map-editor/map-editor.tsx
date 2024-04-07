import { useState } from 'react';

import { Modal } from 'antd';
import { observer } from 'mobx-react-lite'

import { IOnChangeMapView, MapView } from '~/components';
import { useDebounce, useStore } from '~/hooks';
import { ICircle, IGeoBox, IPolygon } from '~/types';

import { MapEditorModalProps } from './map-editor.types';

const mapContainerStyle = {
	height: '75vh',
}

export const MapEditorModal  = observer(({
	initialCircle,
	initialMarker,
	initialPolygon,
	initialZoom,
	initialArea,
	id,
	isVisible,
	onSubmit,
	hide
}: MapEditorModalProps) => {
	const store = useStore();
	const [isLoading, setLoading] = useState(false);

	const [circle, setCircle] = useState(initialCircle);
	const [marker, setMarker] = useState(initialMarker);
	const [polygon, setPolygon] = useState(initialPolygon);
	const [zoom, setZoom] = useState(initialZoom);
	const [area, setArea] = useState(initialArea);

	const onCancel = () => {
		hide();
	};

	const onChange = (value:IOnChangeMapView) => {
		setCircle(value.circle);
		setMarker(value.marker);
		setPolygon(value.polygon);
		setZoom(value.zoom);
		setArea(value.area);
	}

	const onSave = () => {
		onSubmit?.({
			marker,
			polygon,
			circle,
			zoom,
			area,
		});
		hide();
	}
	
	const fetchAllInGeoBox = useDebounce((box: IGeoBox) => {
		store.map.fetchAllInGeoBox.run(box);
		setLoading(false);
	}, [], 2000);

	const onChangeGeobox = (value: { box: IGeoBox, zoom: number}) => {
		if(value.zoom < 16) return;

		setLoading(true);
		fetchAllInGeoBox(value.box);
	};

	// console.log("store.map.list.asArray", store.map.list.asArray.length)

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
				initialCircle={initialCircle}
				initialMarker={initialMarker}
				initialPolygon={initialPolygon}
				initialZoom={initialZoom}
				mapContainerStyle={mapContainerStyle}
				onChange={onChange}
				onChangeGeobox={onChangeGeobox}
				polygons={store.map.list.asArray.filter(el => el.id !== id && !!el.polygon).map(el => el.polygon as IPolygon)}
				circles={store.map.list.asArray.filter(el => el.id !== id && !!el.circle).map(el => el.circle as ICircle)}
				isLoadingVisibleInArea={store.map.fetchAllInGeoBox.inProgress || isLoading}
			/>
		</Modal>
	);
});

