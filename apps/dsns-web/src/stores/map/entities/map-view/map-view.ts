import { type IMapViewActionValue, MapViewActionValue } from './map-view.schema';

export type IMapViewAction = IMapViewActionValue;

export class MapViewAction extends MapViewActionValue implements IMapViewAction {
    constructor(value: IMapViewActionValue) {
        super(value);
    }
}