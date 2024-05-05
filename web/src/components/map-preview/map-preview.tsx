import { memo, useState, useRef, useEffect } from "react";

import { Button, Tooltip, Typography } from "antd";
import { GoogleMap, GoogleMapProps, Marker, Circle, Polygon, Polyline } from '@react-google-maps/api';
import { Dayjs } from "dayjs";

import { useMapOptions, useVisibleMap } from "~/hooks";
import { ICircle, ILine, IPoint, IPolygon } from "~/types/map";
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
import { MapZoomView } from "../map-zoom-view";
import { useLineCallout } from "./use-line-callout";

interface IMapViewProps extends Pick<GoogleMapProps, "children" | "mapContainerStyle"> {
	marker?: IPoint | undefined;
	circle?: ICircle | undefined;
	polygon?: IPolygon | undefined;
	line?: ILine | undefined;
	zoom?: number;
	date?: Dayjs;
	explosiveObjects?: string[];
	position?: IPoint;
	city?: string;
	isEdit: boolean;
	initialZoom?: number;
	onEdit: () => void;
	onChange: (value: { zoom: number }) => void;
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
	line,
	city,
	onChange,
	initialZoom,
	...rest
}: IMapViewProps) {	
	const {
		 mapOptions, polygonOptions, circleOptions, toggleMapType, lineOptions
	 } = useMapOptions({ isPictureType: true });

	const mapRef = useRef<google.maps.Map>();
	const isVisibleMap = useVisibleMap({ mapRef });
	const [zoom, setZoom] = useState<number>(initialZoom ?? MAP_ZOOM.DEFAULT);

	const onLoadMap = (map:google.maps.Map) => {
		mapRef.current = map;
	}

	const onZoomChanged = () => {
		if(!mapRef?.current) return;
		const newZoom = mapRef.current.getZoom() as number;
		setZoom(newZoom);
		onChange?.({ zoom: newZoom });
	};

	const onChangeZoomView = (value:number) => {
		if(!mapRef?.current) return;
		mapRef?.current?.setZoom(value);
	};

	const lineCallout = useLineCallout({ line, zoom, isVisibleMap, offset: 20 })
	const polygonCallout = usePolygonCallout({ polygon, zoom, isVisibleMap, offset: 20 })
	const markerCallout = useMarkerCallout({ marker, zoom, mapRef, polygonCallout, isVisibleMap});

	useEffect(() => {
		if(initialZoom && isVisibleMap){
			mapRef?.current?.setZoom(initialZoom);
		}
	}, [isVisibleMap, initialZoom]);

	const isVisiblePolygon = !!polygon?.points.length;
	const isVisibleLine = !!line?.points.length;
	const isVisibleCircle = !!circle?.center && circle?.radius;
	const isVisibleMarker = !!marker;
	const isVisibleMarkerCallout = isVisibleMarker && explosiveObjects?.length && date && !!markerCallout;
	const isVisiblePolygonCallout = isVisiblePolygon;
	const isVisibleLineCallout = isVisibleLine;

	const area = getArea(circle, polygon, line);
	const center = mapUtils.getInfoPoint({ marker, circle, polygon, line});
	const distance = mapUtils.getTotalDistance({ line, polygon });

	return (
		<div css={s.container}>
			<GoogleMap
				mapContainerStyle={s.mapContainerStyle}
				onZoomChanged={onZoomChanged}
				zoom={MAP_ZOOM.DEFAULT}
				center={center}
				options={mapOptions}
				onLoad={onLoadMap}
				{...rest}
			>
				<div css={s.panel}>
					<Tooltip placement="bottomRight" title="Показати умовні позначення" arrow>
						<Button
							onClick={toggleMapType}
							icon={<Icon.TagOutlined /> }
							disabled={false}
							css={[
								s.button,
								mapOptions.mapTypeId === google.maps.MapTypeId.HYBRID ? s.activeButton : undefined
							]}
						/>
					</Tooltip>
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
				{isVisibleLine && (
					<Polyline
						options={lineOptions}
						path={line?.points}
					/>
				)}
				{isVisibleLineCallout && (
					<PolygonCallout 
						points={lineCallout}
					/>
				)}
				{!!city && (
					<div css={[s.callout, s.calloutCity]}>
						<Typography.Text css={[s.calloutText, s.calloutPolygonText]}>{city}</Typography.Text>
					</div>
				)}
				{isEdit && (
					<MapZoomView zoom={zoom} onChange={onChangeZoomView}/>
				)}
				<MapInfo 
					point={center}
					distance={distance}
				    area={area}
				/>
			</GoogleMap>
		</div>
	);
}

export const MapPreview = memo(withMapProvider(Component))