import { type EXPLOSIVE_OBJECT_COMPONENT, type EXPLOSIVE_OBJECT_STATUS } from 'shared-my/db';

export interface IExplosiveObjectForm {
    name: string;
    status: EXPLOSIVE_OBJECT_STATUS;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    countryId: string;
    groupId: string;
    typeId: string;
    classIds: string[];
}
