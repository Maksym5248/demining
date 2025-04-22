import { EXPLOSIVE_OBJECT_COMPONENT } from '../enum';
import { type IExplosiveObjectComponentDB } from '../types';

export const explosiveObjectComponentData: Pick<IExplosiveObjectComponentDB, 'id' | 'name'>[] = [
    {
        id: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        name: 'Боєприпас',
    },
    {
        id: EXPLOSIVE_OBJECT_COMPONENT.FUSE,
        name: 'Підривник',
    },
    {
        id: EXPLOSIVE_OBJECT_COMPONENT.FERVOR,
        name: 'Запал',
    },
    {
        id: EXPLOSIVE_OBJECT_COMPONENT.CD,
        name: 'Капсуль-детонатор',
    },
    {
        id: EXPLOSIVE_OBJECT_COMPONENT.CV,
        name: 'Капсуль-спалахувач',
    },
    {
        id: EXPLOSIVE_OBJECT_COMPONENT.EXPLOSIVE_DEVICE,
        name: 'Підривний пристрій',
    },
];
