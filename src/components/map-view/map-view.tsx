import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Divider, Input, Spin, Typography } from "antd";
import { OVERLAY_MOUSE_TARGET, GoogleMap, useLoadScript, Libraries, GoogleMapProps, DrawingManager, Autocomplete, Marker, Circle, Polyline, OverlayViewF, Polygon } from '@react-google-maps/api';
import { Dayjs } from "dayjs";

import { CONFIG } from "~/config";
import { Icon } from "~/components";
import { useCurrentLocation } from "~/hooks";
import { mapUtils} from "~/utils";
import { ICircle, IPoint, IPolygon } from "~/types/map";
import { MAP_ZOOM } from "~/constants";
import { mathUtils } from "~/utils/math";

import { s } from "./map-view.style";

const libraries:Libraries = ["places", "drawing", "geometry"];

// 1 + initial location based on api address in ukraine
// 2 + callout for marker, to show 
// 3 + show m2 in circle
// 4 - clear items on map
// 5 - вирівняти DrawingManager
  
const defaultCenter = {
	lat: 50.30921013386864, 
	lng: 30.56128765735266,
}

interface IMapViewProps extends Pick<GoogleMapProps, "children" | "mapContainerStyle"> {
	initialMarker?: IPoint | undefined;
	initialCircle?: ICircle | undefined;
	initialPolygon?: IPolygon | undefined;
	initialZoom?: number;
	onChange: (value: {
		polygon?: IPolygon,
		marker?: IPoint,
		circle?: ICircle,
		zoom: number,
	}) => void;
	type?: "picture" | "edit";
	date?: Dayjs;
	explosiveObjects?: string[];
	position?: IPoint;
}

type IMarkerState = google.maps.LatLngLiteral | undefined;
type ICircleState = { center: google.maps.LatLngLiteral, radius: number } | undefined;
type IPolygonState = { points: google.maps.LatLngLiteral[] } | undefined;


const useMapOptions = ({ isPictureType}: { isPictureType: boolean }) => {
	const mapOptions = {
		streetViewControl: false,
		scaleControl: !isPictureType,
		zoomControl: !isPictureType,
		fullscreenControl: false,
		mapTypeId: "satellite",
		mapTypeControl: !isPictureType,
		disableDoubleClickZoom: !isPictureType,
		draggable: !isPictureType,
		isFractionalZoomEnabled: !isPictureType,
		mapTypeControlOptions: {
			style: window?.google?.maps?.MapTypeControlStyle?.DROPDOWN_MENU,
		},
	}
	
	const circleOptions = {
		fillOpacity: 0.3,
		fillColor: '#ff0000',
		strokeColor: '#ff0000',
		strokeWeight: 2,
		draggable: !isPictureType,
		editable: !isPictureType
	}

	const polygonOptions = {
		fillOpacity: 0.3,
		fillColor: '#ff0000',
		strokeColor: '#ff0000',
		strokeWeight: 2,
		draggable: !isPictureType,
		editable: !isPictureType
	}

	const polylineOptions = {
		fillOpacity: 0.3,
		fillColor: '#fff',
		strokeColor: '#fff',
		strokeWeight: 2,
	}

	const markerOptions = {
		draggable: !isPictureType,
		editable: !isPictureType
	};
	
	const drawingManagerOptions  = {
		circleOptions,
		markerOptions,
		polygonOptions,
		drawingControl: !isPictureType,
		drawingControlOptions: {
			position: window?.google?.maps?.ControlPosition?.TOP_LEFT,
			drawingModes: [
				window?.google?.maps?.drawing?.OverlayType?.CIRCLE,
				window?.google?.maps?.drawing?.OverlayType?.MARKER,
				window?.google?.maps?.drawing?.OverlayType?.POLYGON,
			]
		}
	}

	return {
		mapOptions,
		polygonOptions,
		circleOptions,
		polylineOptions,
		drawingManagerOptions
	}
}
function Component({
	initialMarker,
	initialCircle,
	initialPolygon,
	initialZoom,
	onChange,
	type = "edit",
	date,
	explosiveObjects,
	position,
	...rest
}: IMapViewProps) {
	const isPictureType = type === "picture";

	const {
		 mapOptions, polygonOptions, circleOptions, polylineOptions, drawingManagerOptions
	 } = useMapOptions({ isPictureType });

	const mapRef = useRef<google.maps.Map>();
	const autocompleteRef = useRef<google.maps.places.Autocomplete>();
	const drawingManagerRef = useRef<google.maps.drawing.DrawingManager>();
	const circleRef = useRef<google.maps.Circle>();
	const polygonRef = useRef<google.maps.Polygon>();

	const interval = useRef<NodeJS.Timeout>();

	const [marker, setMarker] = useState<IMarkerState>(initialMarker ? mapUtils.getMapPoint(initialMarker): undefined);
	const [circle, setCircle] = useState<ICircleState>(initialCircle ? mapUtils.getMapCircle(initialCircle): undefined);
	const [polygon, setPolygon] = useState<IPolygonState>(initialPolygon ? mapUtils.getMapPolygon(initialPolygon): undefined);

	const [zoom, setZoom] = useState<number>(initialZoom ?? MAP_ZOOM.DEFAULT);
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
	}, [])

	const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
		autocompleteRef.current = autocomplete;
	}

	const onPlaceChanged = () => {
		const { geometry } = autocompleteRef?.current?.getPlace() ?? {};
		const bounds = new window.google.maps.LatLngBounds();

		if (geometry?.viewport) {
			bounds.union(geometry.viewport);
		} else if(geometry?.location){
			bounds.extend(geometry?.location);
		}

		if(geometry?.location){
			setMarker(mapUtils.getPointLiteral(geometry.location));
		}

		mapRef?.current?.fitBounds(bounds);
	}

	const onLoadDrawingManager = (drawingManager: google.maps.drawing.DrawingManager) => {
		drawingManagerRef.current = drawingManager;
	}

	const onLoadCircle = (newCircleRef: google.maps.Circle) => {
		circleRef.current = newCircleRef;
	}

	const onLoadPolygon = (newPolygonRef: google.maps.Polygon) => {
		polygonRef.current = newPolygonRef;
	}

	const _onChange = (value: { polygon?: IPolygon, marker?: IPoint, circle?: ICircle}) => {
		onChange?.({
			polygon: polygon ? mapUtils.getPolygon(polygon) : undefined,
			circle: circle ? mapUtils.getCircle(circle) : undefined,
			marker: marker ? mapUtils.getPoint(marker) : undefined,
			zoom,
			...value
		})
	}

	const onOverlayComplete = (event: google.maps.drawing.OverlayCompleteEvent) => {
		if (event.type === window?.google?.maps?.drawing?.OverlayType.MARKER) {
			const newValue = mapUtils.getPointLiteral((event.overlay as google.maps.Marker)?.getPosition()  as google.maps.LatLng);
			event.overlay?.setMap(null);
			setMarker(newValue);
			mapRef?.current?.setCenter(newValue);
			_onChange?.({ marker: mapUtils.getPoint(newValue) })
		}
		if (event.type === window?.google?.maps?.drawing?.OverlayType.CIRCLE) {
			const newValue =  {
				center: mapUtils.getPointLiteral((event.overlay as google.maps.Circle)?.getCenter() as google.maps.LatLng),
				radius: (event.overlay as google.maps.Circle)?.getRadius()
			}

			event.overlay?.setMap(null);
			setCircle(newValue);
			_onChange?.({ circle: mapUtils.getCircle(newValue) }) // Fixed the property name from 'circle' to 'circe'
		}

		if (event.type === window?.google?.maps?.drawing?.OverlayType.POLYGON) {
			const newValue = {
				points: (event.overlay instanceof google.maps.Polygon)
				 ? event.overlay.getPath().getArray().map(point => mapUtils.getPointLiteral(point))
					: [],
			};

			event.overlay?.setMap(null);
			setPolygon(newValue);
			_onChange?.({ polygon: mapUtils.getPolygon(newValue) })
		}
	}

	const onZoomChanged = () => {
		if(!mapRef?.current){
			return
		}
		
		const newZoom = mapRef.current.getZoom() as number;
	
		setZoom(mapRef.current.getZoom() as number);
		onChange?.({
			marker: marker ? mapUtils.getPoint(marker) : undefined,
			circle: circle ? mapUtils.getCircle(circle) : undefined,
			zoom: newZoom
		})
	};

	const onClickMarker = () => {
		setMarker(undefined)
	};

	const onRadiusChanged = useCallback(() => {
		if(circleRef.current){
			const circleCenter = circleRef.current?.getCenter() as google.maps.LatLng;
			const circleRadius = circleRef.current?.getRadius();

			setCircle({ center: mapUtils.getPointLiteral(circleCenter), radius: circleRadius})
		}
	}, []);
	
	const onDragEnd = useCallback(() => {
		if(circleRef.current){
			const circleCenter = circleRef.current?.getCenter() as google.maps.LatLng;
			const circleRadius = circleRef.current?.getRadius();

			setCircle({ center: mapUtils.getPointLiteral(circleCenter), radius: circleRadius})
		}
	}, []);

	const callout = useMemo(() =>
		mapUtils.adjustPointByPixelOffset(marker, 150, -150, mapRef.current, zoom),
	[marker, mapRef.current, zoom, isVisibleMap]);

	const isVisiblePolygon = !!polygon?.points.length;
	const isVisibleCircle = !!circle?.center && circle?.radius;
	const isVisibleCircleMetaData = isVisibleCircle && !isPictureType;
	const isVisibleMarker = !!marker;
	const isVisibleCallout = isVisibleMarker && !!callout && explosiveObjects?.length && date;

	return (
		<div css={s.container}>
			<div css={s.drawingPanel}>
				{drawingManagerRef.current && (<Icon.DeleteOutlined css={s.deleteIcon} />)}
			</div>
			<GoogleMap
				mapContainerStyle={s.mapContainerStyle}
				zoom={zoom}
				center={isPictureType ? marker: position}
				options={mapOptions}
				onZoomChanged={onZoomChanged}
				onLoad={onLoadMap}
				{...rest}
			>
				<DrawingManager
					// @ts-ignore
					onLoad={onLoadDrawingManager}
					onOverlayComplete={onOverlayComplete}
					options={drawingManagerOptions}
				/>
				{isVisiblePolygon && (
					<Polygon
						onLoad={onLoadPolygon}
					   options={polygonOptions} 
					   {...(circle ?? {})}
					   paths={polygon?.points}
					   onDragEnd={onDragEnd}
					/>
				) }
				{isVisibleCircle && (
					<Circle
						onLoad={onLoadCircle}
					   options={circleOptions} 
					   {...(circle ?? {})}
					   onRadiusChanged={onRadiusChanged} 
					   onDragEnd={onDragEnd}
					/>
				) }
				{isVisibleCircleMetaData && (
					<OverlayViewF
						position={circle?.center}
						getPixelPositionOffset={() => ({ x: 20, y: 20 })}
						mapPaneName={OVERLAY_MOUSE_TARGET}
					>
						<Typography.Text css={s.calloutText}>
							R - {mathUtils.toFixed(circle.radius, 0)} м
						</Typography.Text>
						<Divider css={s.calloutDivider} />
						<Typography.Text css={s.calloutText}>
							S - {mathUtils.squareCircle(circle.radius)} м2
						</Typography.Text>
					</OverlayViewF>
				)}
				{isVisibleMarker && <Marker position={marker} clickable onClick={onClickMarker}/>}
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
				{!isPictureType && (
					<Autocomplete
						onLoad={onLoadAutocomplete}
						onPlaceChanged={onPlaceChanged}
					>
						<Input
							type='text'
							placeholder='Адреса'
							css={s.autocomplete}
						/>
					</Autocomplete>
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

	const position = useCurrentLocation(defaultCenter);


	if (loadError) {
		return <div>Error loading maps</div>;
	}

	if (!isLoaded || position.isLoading) {
		return <div css={s.containerLoading}><Spin/></div>;
	}

	return  <Component position={position.coords} {...props}/>
}

export const MapView = memo(MapLoader)