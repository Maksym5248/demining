export enum MAP_SIZE {
    MEDIUM_HEIGHT = 540,
    MEDIUM_WIDTH = 640 
}

export enum MAP_ZOOM {
    DEFAULT = 15,
}

export const MAP_VIEW_TAKE_PRINT_CONTAINER = "MAP_VIEW_TAKE_PRINT_CONTAINER";

export const DEFAULT_CENTER = {
	lat: 50.30921013386864, 
	lng: 30.56128765735266,
} as const;

export enum MAP_ITEM {
    CIRCLE = "circle",
    POLYGON = "polygon",
    MARKER = "marker",
}