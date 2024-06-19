import * as closestPoint from './closest-point';
import * as common from './common';
import * as fabric from './fabric';
import * as file from './file';
import * as geohash from './geohash';
import * as pixel from './pixel';

export const mapUtils = {
    ...closestPoint,
    ...common,
    ...fabric,
    ...file,
    ...pixel,
    ...geohash,
};
