import { types as t } from 'mobx-state-tree';

import { DateTimeType } from "./datetime";

export * from './store';
export const types ={
    ...t,
    dayjs: DateTimeType
}