import { EXPLOSIVE_OBJECT_GROUP } from '../enum';
import { type IExplosiveObjectGroupDB } from '../types';

export const explosiveObjectGroupsData: IExplosiveObjectGroupDB[] = [
    {
        id: EXPLOSIVE_OBJECT_GROUP.AVIATION_BOMBS,
        name: 'АБ',
        fullName: 'Авіаційна бомба',
        hasCaliber: true,
    },
    {
        id: EXPLOSIVE_OBJECT_GROUP.ARTILLERY_SHELLS,
        name: 'АС',
        fullName: 'Артилерійський снаряд',
        hasCaliber: true,
    },
    {
        id: EXPLOSIVE_OBJECT_GROUP.MORTAL_MINES,
        name: 'ММ',
        fullName: 'Мінометна Міна',
        hasCaliber: true,
    },
    {
        id: EXPLOSIVE_OBJECT_GROUP.HANDLE_GRENADES,
        name: 'РГ',
        fullName: 'Ручна Граната',
        hasCaliber: false,
    },
    {
        id: EXPLOSIVE_OBJECT_GROUP.ENGINEERING,
        name: 'ІМ',
        fullName: 'Інженерна міна',
        hasCaliber: false,
    },
    {
        id: EXPLOSIVE_OBJECT_GROUP.AMMO,
        name: 'Набої',
        fullName: 'Боєприпас стрілецької зброї',
        hasCaliber: true,
    },
    // {
    //     id: '2',
    //     name: 'НУРС',
    //     fullName: 'Некерована авіаційна ракета',
    // },
    // {
    //     id: '8',
    //     name: 'ПТУР',
    //     fullName: 'Протитанковий керований реактивний снаряд',
    // },
    // {
    //     id: '9',
    //     name: 'ЗРК',
    //     fullName: 'Зенітний ракетний снаряд',
    // },
    // {
    //     id: '10',
    //     name: 'Крилата ракета',
    //     fullName: 'Крилата ракета',
    // },
    // {
    //     id: '11',
    //     name: 'Балістична ракета',
    //     fullName: 'Балістична ракета',
    // },
    // {
    //     id: '12',
    //     name: 'БПЛА',
    //     fullName: 'Безпілотний літальний апарат',
    // },
];
