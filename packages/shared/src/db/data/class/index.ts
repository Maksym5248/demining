import { arteleryDataItems, arteleryClassData } from './artelery';
import { engineeringDataItems, engineeringClassData } from './engineering';
import { rocketDataItems, rocketClassData } from './rocket';

export const explosiveObjectClassData = [...engineeringClassData, ...rocketClassData, ...arteleryClassData];
export const explosiveObjectClassDataItems = [...engineeringDataItems, ...rocketDataItems, ...arteleryDataItems];
