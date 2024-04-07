import { memo, useEffect, useMemo, useRef, useState } from "react";

import { Button , Divider, Spin, Typography } from "antd";
import { OVERLAY_MOUSE_TARGET, GoogleMap, useLoadScript, Libraries, GoogleMapProps, Marker, Circle, Polyline, OverlayViewF, Polygon } from '@react-google-maps/api';
import { Dayjs } from "dayjs";

import { CONFIG } from "~/config";
import { useCurrentLocation, useMapOptions } from "~/hooks";
import { mapUtils} from "~/utils";
import { ICircle, IPoint, IPolygon } from "~/types/map";
import { DEFAULT_CENTER, MAP_ZOOM } from "~/constants";

import { s } from "./map-preview.style";
import { Icon } from "../icon";

const libraries:Libraries = ["places", "drawing", "geometry"];

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
		 mapOptions, polygonOptions, circleOptions, polylineOptions
	 } = useMapOptions({ isPictureType: true });

	const mapRef = useRef<google.maps.Map>();
	const interval = useRef<NodeJS.Timeout>();

	const zoom = rest?.zoom ?? MAP_ZOOM.DEFAULT;
	
	const [isVisibleMap, setVisibleMap] = useState(false);

	const onLoadMap = (map:google.maps.Map) => {
		mapRef.current = map;
	}

	useEffect(() => {
		interval.current = setInterval(() => {
			if(mapRef.current && mapRef.current.getProjection()){
				setVisibleMap(true);
				clearInterval(interval.current);
			}
		},  100);

		return () => {
			if(interval.current){
				clearInterval(interval.current)
			}
		}
	}, []);

	const callout = useMemo(() =>
		mapUtils.getPointByPixelOffset(marker, 150, -150, mapRef.current, zoom),
	[marker, mapRef.current, zoom, isVisibleMap]);

	const isVisiblePolygon = !!polygon?.points.length;
	const isVisibleCircle = !!circle?.center && circle?.radius;
	const isVisibleMarker = !!marker;
	const isVisibleCallout = isVisibleMarker && !!callout && explosiveObjects?.length && date;

	return (
		<div css={s.container}>
			<GoogleMap
				mapContainerStyle={s.mapContainerStyle}
				zoom={zoom ?? MAP_ZOOM.DEFAULT}
				center={marker}
				options={mapOptions}
				onLoad={onLoadMap}
				{...rest}
			>
				{isEdit && (
					<Button
						css={s.editButton}
						onClick={onEdit}
						icon={<Icon.EditOutlined /> }
					/>
				)}
				
				{isVisiblePolygon && (
					<Polygon
					   options={polygonOptions} 
					   {...(circle ?? {})}
					   paths={polygon?.points}
					/>
				) }
				{isVisibleCircle && (
					<Circle
					   options={circleOptions} 
					   {...(circle ?? {})}
					/>
				) }
				{isVisibleMarker && <Marker position={marker}/>}
				{isVisibleCallout && (
					<OverlayViewF
						position={callout}
						mapPaneName={OVERLAY_MOUSE_TARGET}
					>
						<div css={s.callout}>
							<div css={s.calloutHeader} >
								{explosiveObjects.map((el, i) => (
									<Typography.Text key={i}  css={s.calloutText}>
										{el}
									</Typography.Text>
								))}
							</div>
							<Divider css={s.calloutDivider} />
							<Typography.Text css={s.calloutText}>{date?.format('DD.MM.YYYY')}</Typography.Text>
						</div>
					</OverlayViewF>
				)}
				{isVisibleCallout && (
					<Polyline
						options={polylineOptions}
						path={[marker, callout]}
					/>
				)}
			</GoogleMap>
		</div>
	);
}


function MapLoader(props: IMapViewProps) {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: CONFIG.GOOGLE_API_KEY,
		language: "uk",
		libraries,
	});

	const position = useCurrentLocation(DEFAULT_CENTER);

	if (loadError) {
		return <div>Error loading maps</div>;
	}

	if (!isLoaded || position.isLoading) {
		return <div css={s.containerLoading}><Spin/></div>;
	}

	return  <Component position={position.coords} {...props}/>
}

export const MapPreview = memo(MapLoader)