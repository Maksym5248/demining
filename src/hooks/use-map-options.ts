export const useMapOptions = ({ isPictureType}: { isPictureType: boolean }) => {
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