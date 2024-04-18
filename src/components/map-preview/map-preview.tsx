import { memo, useState, useRef } from "react";

import { Button } from "antd";
import { GoogleMap, GoogleMapProps, Marker, Circle, Polygon } from '@react-google-maps/api';
import { Dayjs } from "dayjs";

import { useMapOptions, useFitBounds, useVisibleMap } from "~/hooks";
import { ICircle, IPoint, IPolygon } from "~/types/map";
import { MAP_ZOOM } from "~/constants";
import { withMapProvider } from "~/hoc";
import { mapUtils } from "~/utils";
import { getArea } from "~/utils/map/common";

import { s } from "./map-preview.style";
import { Icon } from "../icon";
import { MarkerCallout } from "./marker-callout";
import { PolygonCallout } from "./polygon-callout";
import { MapInfo } from "../map-info";
import { usePolygonCallout } from "./use-polygon-callout";
import { useMarkerCallout } from "./use-marker-callout";

interface IMapViewProps extends Pick<GoogleMapProps, "children" | "mapContainerStyle"> {
	marker?: IPoint | undefined;
	circle?: ICircle | undefined;
	polygon?: IPolygon | undefined;
	zoom?: number;
	date?: Dayjs;
	explosiveObjects?: string[];
	position?: IPoint;
	isEdit: boolean;
	onEdit: () => void;
}

function Component({
	date,
	explosiveObjects,
	position,
	isEdit,
	onEdit,
	marker,
	circle,
	polygon,
	...rest
}: IMapViewProps) {

	const {
		 mapOptions, polygonOptions, circleOptions,
	 } = useMapOptions({ isPictureType: true });

	const mapRef = useRef<google.maps.Map>();
	const isVisibleMap = useVisibleMap({ mapRef });
	const [zoom, setZoom] = useState<number>(MAP_ZOOM.DEFAULT);

	const onLoadMap = (map:google.maps.Map) => {
		mapRef.current = map;
	}

	const onZoomChanged = () => {
		if(!mapRef?.current) return;
		setZoom(mapRef.current.getZoom() as number);
	};

	const polygonCallout = usePolygonCallout({ polygon, zoom, isVisibleMap, offset: 20 })
	const markerCallout = useMarkerCallout({ marker, zoom, mapRef, isVisibleMap})

	useFitBounds({
		marker,
		markerCallout,
		circle,
		polygon,
		polygonCallout,
		mapRef,
		isVisibleMap
	})

	const isVisiblePolygon = !!polygon?.points.length;
	const isVisibleCircle = !!circle?.center && circle?.radius;
	const isVisibleMarker = !!marker;
	const isVisibleMarkerCallout = isVisibleMarker && explosiveObjects?.length && date && !!markerCallout;
	const isVisiblePolygonCallout = isVisiblePolygon;

	const area = getArea(circle, polygon);

	return (
		<div css={s.container}>
			<GoogleMap
				mapContainerStyle={s.mapContainerStyle}
				onZoomChanged={onZoomChanged}
				zoom={MAP_ZOOM.DEFAULT}
				center={marker ?? position}
				options={mapOptions}
				onLoad={onLoadMap}
				{...rest}
			>
				<div css={s.panel}>
					{isEdit && (
						<Button
							css={s.button}
							onClick={onEdit}
							icon={<Icon.EditOutlined /> }
						/>
					)}
				</div>

				{isVisiblePolygon && (
					<Polygon
					   options={polygonOptions}
					   paths={polygon?.points}
					   {...(polygon ?? {})}
					/>
				) }
				{isVisibleCircle && (
					<Circle
					   options={circleOptions} 
					   {...(circle ?? {})}
					/>
				) }
				{isVisibleMarker && <Marker position={marker}/>}
				{isVisibleMarkerCallout && (
					<MarkerCallout
						date={date}
						explosiveObjects={explosiveObjects}
						marker={marker}
						callout={markerCallout}
					/>
				)}
				{isVisiblePolygonCallout && (
					<PolygonCallout 
						points={polygonCallout}
					/>
				)}
				<MapInfo point={mapUtils.getInfoPoint({ marker, circle, polygon})} area={area}/>
			</GoogleMap>
		</div>
	);
}

export const MapPreview = memo(withMapProvider(Component))