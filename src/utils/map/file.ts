import { isArray } from "lodash";

import { ICircle, IPoint, IPolygon } from "~/types";

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

export {
	generateKML
}