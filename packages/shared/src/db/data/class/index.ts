import { engineeringDataItems, engineeringClassData } from './engineering';
import { rocketDataItems, rocketClassData } from './rocket';

export const explosiveObjectClassData = [...engineeringClassData, ...rocketClassData];
export const explosiveObjectClassDataItems = [...engineeringDataItems, ...rocketDataItems];
