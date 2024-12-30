import { engineeringDataItems, engineeringClassData } from './engineering';
import { rocketDataItems, rocketClassData } from './rocket';

export const explosiveObjectClassData1 = [...engineeringClassData, ...rocketClassData];
export const explosiveObjectClassDataItems1 = [...engineeringDataItems, ...rocketDataItems];
