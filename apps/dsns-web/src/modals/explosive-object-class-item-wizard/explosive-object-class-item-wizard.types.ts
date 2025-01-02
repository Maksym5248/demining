import { type EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

export interface IExplosiveObjectClassItemForm {
    name: string;
    classId: string;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    parentId: string | null;
}
