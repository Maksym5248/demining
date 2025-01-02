import { type EXPLOSIVE_OBJECT_CLASS, type EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

export interface IExplosiveObjectClassForm {
    component: EXPLOSIVE_OBJECT_COMPONENT;
    class: EXPLOSIVE_OBJECT_CLASS;
    name: string;
    parentId?: string;
}
