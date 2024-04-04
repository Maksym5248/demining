import { isArray } from "lodash";

import { ICircle, IPoint, IPolygon, IGeoBox } from "~/types";


const getPointLiteral = (latLng: google.maps.LatLng) => ({
	lng: latLng?.lng(),
	lat: latLng?.lat(),
})

const getComputedOffset = (latLng: google.maps.LatLngLiteral  | undefined, distance:number | undefined, bearing:number) => {
	if(!latLng || !distance){
		return null;
	}

	const value = window?.google.maps.geometry.spherical.computeOffset(latLng, distance, bearing);
	
	if(!value){
		return null
	}

	return getPointLiteral(value)
}

function adjustPointByPixelOffset(
	latLng: google.maps.LatLngLiteral | undefined | null,
	xOffset:number,
	yOffset:number,
	map:google.maps.Map | undefined,
	zoom:number
):google.maps.LatLngLiteral | null {
	if(!map || !latLng){
		return null;
	}

	const scale = 2**(zoom ?? 1);
	const projection = map.getProjection();

	if(!projection){
		return null
	}

	const point = projection?.fromLatLngToPoint(latLng);

	if(!point){
		return null
	}

	point.x += xOffset / scale;
	point.y += yOffset / scale;

	const value = projection.fromPointToLatLng(point);

	if(!value){
		return null
	}

	return getPointLiteral(value)

};


function getMapCircle(circle: ICircle) {
	return {
		center: circle.center,
		radius: circle.radius
	}
};

function getMapPolygon(polygon: IPolygon) {
	return {
		points: polygon.points,
	}
};

function getPoint(latLang: google.maps.LatLngLiteral):IPoint {
	return {
		lat: latLang.lat,
		lng: latLang.lng,
	}
};

function getCircle(circle: { center: google.maps.LatLngLiteral, radius: number }):ICircle {
	return {
		center: getPoint(circle.center),
		radius: circle.radius
	}
};

function getPolygon(polygon: { points: google.maps.LatLngLiteral[] }):IPolygon {
	return {
		points: polygon?.points?.map(getPoint),
	}
};

function getMapPoint(latLang: IPoint) {
	return latLang
};

function generateKML(points: IPoint | IPoint[], circles: ICircle | ICircle[], polygons: IPolygon |IPolygon[]): string {
	const pointsData = (isArray(points) ? points : [points]).filter(el => !!el);
	const circlesData = (isArray(circles) ? circles : [circles]).filter(el => !!el);
	const polygonsData  = (isArray(polygons) ? polygons : [polygons]).filter(el => !!el);

	let kml = '<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n';
  
	pointsData.forEach(point => {
	  kml += `<Placemark><Point><coordinates>${point.lng},${point.lat}</coordinates></Point></Placemark>\n`;
	});
  
	circlesData.forEach(circle => {
		const numPoints = 100; // Number of points to define the circle
		const d2r = Math.PI / 180; // degrees to radians
		const r2d = 180 / Math.PI; // radians to degrees
		const earthRadius = 6378137; // Earth radius in meters
		const circlePoints = [];
	
		for (let i = 0; i < numPoints + 1; i+=1) {
		  const theta = Math.PI * (i / (numPoints / 2));
		  const dx = circle.radius * Math.cos(theta);
		  const dy = circle.radius * Math.sin(theta);
		  const lat = circle.center.lat + (dy / earthRadius) * r2d;
		  const lng = circle.center.lng + (dx / (earthRadius * Math.cos(lat * d2r))) * r2d;
		  circlePoints.push({ lat, lng });
		}
	
		kml += '<Placemark>\n';
		kml += '<Style>\n';
		kml += '<LineStyle><color>ff0000ff</color></LineStyle>\n'; // Red stroke
		kml += '<PolyStyle><color>4Dff0000</color></PolyStyle>\n'; // Semi-transparent green fill
		kml += '</Style>\n';
		kml += '<Polygon><outerBoundaryIs><LinearRing><coordinates>';
		circlePoints.forEach(point => {
		  kml += `${point.lng},${point.lat} `;
		});
		kml += '</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>\n';
	  });
  
	polygonsData.forEach(value => {
	  const pointsPolygon = [...value.points, value.points[0]];

	  kml += '<Placemark>\n';
	  kml += '<Style>\n';
	  kml += '<LineStyle><color>ff0000ff</color></LineStyle>\n'; // Red stroke
	  kml += '<PolyStyle><color>4D0000ff</color></PolyStyle>\n'; // Semi-transparent green fill
	  kml += '</Style>\n';
	  kml += '<Polygon><outerBoundaryIs><LinearRing><coordinates>';
	  pointsPolygon.forEach(point => {
			kml += `${point.lng},${point.lat} `;
	  });
	  kml += '</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>\n';
	});
  
	kml += '</Document>\n</kml>';
	return kml;
}


function getRadiusByZoom(center: IPoint, zoom:number ): number {
	return 156543.03392 * Math.cos(center.lat * Math.PI / 180) / 2**zoom;
}

// radius in meters
function getBoundingBox(center: IPoint, { zoom, radius }: ( { zoom?: number, radius?: number}) ): IGeoBox {
	// distance in meters
	const distance = radius ?? getRadiusByZoom(center, zoom as number);

	const topLeft = google.maps.geometry.spherical.computeOffset(center, distance, 315);
	const bottomRight = google.maps.geometry.spherical.computeOffset(center, distance, 135);

	return {
		topLeft: { lat: topLeft.lat(), lng: topLeft.lng() },
		bottomRight: { lat: bottomRight.lat(), lng: bottomRight.lng() },
	};
}

export const mapUtils = {
	getPointLiteral,
	getPoint,
	getCircle,
	getPolygon,
	getMapPoint,
	getMapCircle,
	getMapPolygon,
	adjustPointByPixelOffset,
	getComputedOffset,
	generateKML,
	getBoundingBox,
}