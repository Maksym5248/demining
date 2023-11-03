import { types as t } from 'mobx-state-tree';

import { DateTimeType } from "./datetime";

export const types ={
    ...t,
    dayjs: DateTimeType
}