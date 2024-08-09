import { EXPLOSIVE_OBJECT_CLASS, EXPLOSIVE_OBJECT_GROUP, EXPLOSIVE_OBJECT_COMPONENT } from '../enum';
import { type IExplosiveObjectClassItemDB, type IExplosiveObjectClassDB } from '../types';

export const explosiveObjectClassData: IExplosiveObjectClassDB[] = [
    {
        id: EXPLOSIVE_OBJECT_CLASS.PURPOSE,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        groupId: EXPLOSIVE_OBJECT_GROUP.ENGINEERING,
        name: 'за призначенням',
    },
    {
        id: EXPLOSIVE_OBJECT_CLASS.METHOD,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        groupId: EXPLOSIVE_OBJECT_GROUP.ENGINEERING,
        name: 'За способом ураження',
    },
    {
        id: EXPLOSIVE_OBJECT_CLASS.FRAGMENTATION,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        groupId: EXPLOSIVE_OBJECT_GROUP.ENGINEERING,
        name: 'За зоною розльоту осколків',
    },
];

export const explosiveObjectClassItemsPurposeData: IExplosiveObjectClassItemDB[] = [
    {
        id: '1',
        classId: EXPLOSIVE_OBJECT_CLASS.PURPOSE,
        parentId: null,
        name: 'Протитанковий',
    },
    {
        id: '1.1',
        classId: EXPLOSIVE_OBJECT_CLASS.PURPOSE,
        parentId: '1',
        name: 'Протигусинечний',
    },
    {
        id: '1.2',
        classId: EXPLOSIVE_OBJECT_CLASS.PURPOSE,
        parentId: '1',
        name: 'Протиднищевий',
    },
    {
        id: '1.3',
        classId: EXPLOSIVE_OBJECT_CLASS.PURPOSE,
        parentId: '1',
        name: 'Протибортовий',
    },
    {
        id: '2',
        classId: EXPLOSIVE_OBJECT_CLASS.PURPOSE,
        parentId: null,
        name: 'Протипіхотний',
    },
    {
        id: '3',
        classId: EXPLOSIVE_OBJECT_CLASS.PURPOSE,
        parentId: null,
        name: 'Протитранспортні',
    },
    {
        id: '4',
        classId: EXPLOSIVE_OBJECT_CLASS.PURPOSE,
        parentId: null,
        name: 'Протидесантні',
    },
    {
        id: '5',
        classId: EXPLOSIVE_OBJECT_CLASS.PURPOSE,
        parentId: null,
        name: "Об'єктні",
    },
    {
        id: '6',
        classId: EXPLOSIVE_OBJECT_CLASS.PURPOSE,
        parentId: null,
        name: 'Спеціальні',
    },
];

export const explosiveObjectClassItemsMethodData = [
    {
        id: '2.1.1',
        classId: EXPLOSIVE_OBJECT_CLASS.METHOD,
        parentId: '2',
        name: 'Осколковий',
    },
    {
        id: '2.1.2',
        classId: EXPLOSIVE_OBJECT_CLASS.METHOD,
        parentId: '2',
        name: 'Фугасний',
    },
];

export const explosiveObjectClassItemsFragmentationData = [
    {
        id: '2.2.1',
        classId: EXPLOSIVE_OBJECT_CLASS.FRAGMENTATION,
        parentId: '2',
        name: 'Кругового розльоту',
    },
    {
        id: '2.2.2',
        classId: EXPLOSIVE_OBJECT_CLASS.FRAGMENTATION,
        parentId: '2',
        name: 'Направленного розльоту',
    },
];

export const explosiveObjectClassDataItems = [
    ...explosiveObjectClassItemsPurposeData,
    ...explosiveObjectClassItemsMethodData,
    ...explosiveObjectClassItemsFragmentationData,
];
