import { type EXPLOSIVE_OBJECT_GROUP, type EXPLOSIVE_OBJECT_STATUS } from 'shared-my/db';

export interface IExplosiveObjectForm {
    name: string;
    status: EXPLOSIVE_OBJECT_STATUS;
    group: EXPLOSIVE_OBJECT_GROUP;
    typeIds: string[];
}
