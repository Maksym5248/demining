import { DrawingType } from "~/components"

export const useMapOptions = ({ isPictureType, isCreating, drawing }: { isPictureType: boolean, isCreating?: boolean, drawing?: DrawingType }) => {
	const mapOptions = {
		streetViewControl: false,
		scaleControl: false,
		zoomControl: false,
		fullscreenControl: false,
		mapTypeId: "satellite",
		mapTypeControl: false,
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
		draggable: !isPictureType && drawing !== DrawingType.MOVE && drawing !== DrawingType.MARKER,
		editable: !isPictureType && drawing !== DrawingType.MOVE && drawing !== DrawingType.MARKER,
		clickable: !isPictureType && !isCreating && drawing !== DrawingType.MOVE && drawing !== DrawingType.MARKER,
	}

	const polygonOptions = {
		fillOpacity: 0.3,
		fillColor: '#ff0000',
		strokeColor: '#ff0000',
		strokeWeight: 2,
		draggable: !isPictureType && drawing !== DrawingType.MOVE && drawing !== DrawingType.MARKER,
		editable: !isPictureType && drawing !== DrawingType.MOVE && drawing !== DrawingType.MARKER,
		clickable: !isPictureType && !isCreating && drawing !== DrawingType.MOVE && drawing !== DrawingType.MARKER,
	}

	const polylineOptions = {
		fillOpacity: 0.3,
		fillColor: '#fff',
		strokeColor: '#fff',
		strokeWeight: 2,
	}

	const createPolygonOptions = {
		fillOpacity: 0,
		fillColor: '#ff0000',
		strokeColor: '#ff0000',
		strokeWeight: 2,
		draggable: true,
		editable: true,
	}

	return {
		mapOptions,
		polygonOptions,
		circleOptions,
		polylineOptions,
		createPolygonOptions,
	}
}