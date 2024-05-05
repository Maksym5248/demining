import * as closestPoint from "./closest-point";
import * as common from "./common";
import * as fabric from "./fabric";
import * as file from "./file";
import * as pixel from "./pixel";
import * as geohash from "./geohash";
import * as api from "./api";

export const mapUtils = {
	...closestPoint,
	...common,
	...fabric,
	...file,
	...pixel,
	...geohash,
	...api,
}