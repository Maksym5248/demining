import * as closestPoint from "./closest-point";
import * as common from "./common";
import * as fabric from "./fabric";
import * as file from "./file";
import * as pixel from "./pixel";
import * as geohash from "./geohash";

export const mapUtils = {
	...closestPoint,
	...common,
	...fabric,
	...file,
	...pixel,
	...geohash
}