import { isArray } from 'lodash';

import { type ICircle, type IPoint, type IPolygon } from '../types';

function generatePoints(points?: IPoint | IPoint[]): string {
    if (!points) return '';

    const pointsData = isArray(points) ? points : [points];
    let kml = '';

    pointsData.forEach((point) => {
        kml += `<Placemark><Point><coordinates>${point.lng},${point.lat}</coordinates></Point></Placemark>\n`;
    });

    return kml;
}

function generateCircles(circles?: ICircle | ICircle[]): string {
    if (!circles) return '';

    const circlesData = isArray(circles) ? circles : [circles];
    let kml = '';

    circlesData.forEach((circle) => {
        kml += '<Placemark>\n';
        kml += '<Style>\n';
        kml += '<LineStyle><color>ff0000ff</color></LineStyle>\n'; // Red stroke
        kml += '<PolyStyle><color>4Dff0000</color></PolyStyle>\n'; // Semi-transparent green fill
        kml += '</Style>\n';
        kml += '<Polygon><outerBoundaryIs><LinearRing><coordinates>';
        kml += `${circle.center.lng},${circle.center.lat} `;
        kml += '</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>\n';
    });

    return kml;
}

function generatePolygons(polygons?: IPolygon | IPolygon[]): string {
    if (!polygons) return '';

    const polygonsData = isArray(polygons) ? polygons : [polygons];
    let kml = '';

    polygonsData.forEach((value) => {
        const pointsPolygon = [...value.points, value.points[0]];

        kml += '<Placemark>\n';
        kml += '<Style>\n';
        kml += '<LineStyle><color>ff0000ff</color></LineStyle>\n'; // Red stroke
        kml += '<PolyStyle><color>4D0000ff</color></PolyStyle>\n'; // Semi-transparent green fill
        kml += '</Style>\n';
        kml += '<Polygon><outerBoundaryIs><LinearRing><coordinates>';
        pointsPolygon.forEach((point) => {
            kml += `${point.lng},${point.lat} `;
        });
        kml += '</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>\n';
    });

    return kml;
}

export function generateKML(params?: {
    points?: IPoint | IPoint[];
    circles?: ICircle | ICircle[];
    polygons?: IPolygon | IPolygon[];
}): string {
    let kml = '<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n';

    const pointsKml = generatePoints(params?.points);
    const circlesKml = generateCircles(params?.circles);
    const polygonsKml = generatePolygons(params?.polygons);

    kml += pointsKml + circlesKml + polygonsKml;

    kml += '</Document>\n</kml>';
    return kml;
}
