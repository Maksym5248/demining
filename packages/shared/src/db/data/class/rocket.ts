import { EXPLOSIVE_OBJECT_GROUP, EXPLOSIVE_OBJECT_COMPONENT, EXPLOSIVE_OBJECT_CLASS } from '../../enum';
import { type IExplosiveObjectClassItemDB, type IExplosiveObjectClassDB } from '../../types';

export const explosiveObjectClassData: IExplosiveObjectClassDB[] = [
    {
        id: 'f3887427-71d6-4965-a87b-80943d186f39',
        class: EXPLOSIVE_OBJECT_CLASS.TRAJECTORY,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        groupId: EXPLOSIVE_OBJECT_GROUP.ROСKET,
        name: 'За траєкторією',
    },
    {
        id: '8d8cf76f-cf39-4b42-85a8-0176da849203',
        class: EXPLOSIVE_OBJECT_CLASS.CLASS,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        groupId: EXPLOSIVE_OBJECT_GROUP.ROСKET,
        name: 'За місцем старту і напревленням польоту (Клас)',
    },
    {
        id: '8d8cf76f-cf39-4b42-85a8-0176da849203',
        class: EXPLOSIVE_OBJECT_CLASS.RANGE,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        groupId: EXPLOSIVE_OBJECT_GROUP.ROСKET,
        name: 'За дальністю польоту',
    },
    {
        id: 'a2690948-3e21-4645-a3e2-746411209b4e',
        class: EXPLOSIVE_OBJECT_CLASS.ENGINE,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        groupId: EXPLOSIVE_OBJECT_GROUP.ROСKET,
        name: 'За типом двигуна',
    },
    {
        id: '852257d8-13ad-472c-b3db-39e4c8112ce1',
        class: EXPLOSIVE_OBJECT_CLASS.CHARGE,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        groupId: EXPLOSIVE_OBJECT_GROUP.ROСKET,
        name: 'За типом заряду(боєголовки)',
    },
    {
        id: '2f510177-89bf-457b-a738-17b98212d8b4',
        class: EXPLOSIVE_OBJECT_CLASS.SPEED,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        groupId: EXPLOSIVE_OBJECT_GROUP.ROСKET,
        name: 'За швидкістю польоту',
    },
    {
        id: '428f998e-58db-4c92-8884-10f938aaee21',
        class: EXPLOSIVE_OBJECT_CLASS.TARGETING_SYSTEM,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        groupId: EXPLOSIVE_OBJECT_GROUP.ROСKET,
        name: 'За системою наведення',
    },
];

export const rocketTrajectoryData: IExplosiveObjectClassItemDB[] = [
    {
        id: '10c7690a-e0ca-4f80-8e76-ad4a5aeb5b19',
        classId: EXPLOSIVE_OBJECT_CLASS.TRAJECTORY,
        parentId: null,
        name: 'Крилата',
        description: 'Ракета з керованим двигуном',
    },
    {
        id: '747a05ec-2c53-475f-b3f2-b6abcbd9727e',
        classId: EXPLOSIVE_OBJECT_CLASS.TRAJECTORY,
        parentId: null,
        name: 'Балістична',
        description: 'Ракета яка має бальстичну траєкторію на більшій частині польоту',
    },
];

export const rocketSpeedCruiseData: IExplosiveObjectClassItemDB[] = [
    {
        id: 'ba75f2b7-1043-422c-9c06-a8d34c9f51dd',
        classId: EXPLOSIVE_OBJECT_CLASS.SPEED,
        parentId: '10c7690a-e0ca-4f80-8e76-ad4a5aeb5b19',
        name: 'Дозвукова',
        description: 'Швидкість польоту ракети менше швидкості звукуб до 0.8 маха',
    },
    {
        id: 'd7311cd1-7203-4762-855b-e0b272cb4b93',
        classId: EXPLOSIVE_OBJECT_CLASS.SPEED,
        parentId: '10c7690a-e0ca-4f80-8e76-ad4a5aeb5b19',
        name: 'Надзвукова',
        description: 'Швидкість польоту ракети більше швидкості звуку, 2-3 маха',
    },
    {
        id: '9307de6f-7f9c-4d3a-b8b0-3cd0b75e14b7',
        classId: EXPLOSIVE_OBJECT_CLASS.SPEED,
        parentId: '10c7690a-e0ca-4f80-8e76-ad4a5aeb5b19',
        name: 'Гіперзвукова',
        description: 'Швидкість польоту ракети більше швидкості звуку, більше 5 махів',
    },
];

export const rocketClassData: IExplosiveObjectClassItemDB[] = [
    {
        id: 'fdc97624-ff39-4530-94df-4c817f04adb9',
        classId: EXPLOSIVE_OBJECT_CLASS.CLASS,
        parentId: null,
        name: 'Земля-земля',
    },
    {
        id: 'cb3fbeb3-7499-4ae4-bd8c-fd7808eda3e8',
        classId: EXPLOSIVE_OBJECT_CLASS.CLASS,
        parentId: null,
        name: 'Земля-повітря',
    },
    {
        id: '88703139-aeec-4bdf-96a9-036298097ce7',
        classId: EXPLOSIVE_OBJECT_CLASS.CLASS,
        parentId: null,
        name: 'Земля-море',
    },
    {
        id: '7cb1a9d2-6bdd-4b79-84fb-a6f1948b62f1',
        classId: EXPLOSIVE_OBJECT_CLASS.CLASS,
        parentId: null,
        name: 'Повітря-повітря',
    },
    {
        id: '1060c1c3-6ed4-4212-8ec0-5ed1f23506e4',
        classId: EXPLOSIVE_OBJECT_CLASS.CLASS,
        parentId: null,
        name: 'Повітря-поверхня (земля, вода)',
    },
    {
        id: 'b678dd94-06a5-4e81-9901-a4b59ff3511d',
        classId: EXPLOSIVE_OBJECT_CLASS.CLASS,
        parentId: null,
        name: 'Море-море',
    },
    {
        id: '876db432-c7d5-45af-a746-9857347b82ed',
        classId: EXPLOSIVE_OBJECT_CLASS.CLASS,
        parentId: null,
        name: 'Море-земля',
    },

    // протитанкові
];

export const rocketRangeBallisticData: IExplosiveObjectClassItemDB[] = [
    {
        id: 'f4b59cba-9f9a-41cd-ba8b-26e2db3d2f7e',
        classId: EXPLOSIVE_OBJECT_CLASS.RANGE,
        parentId: '747a05ec-2c53-475f-b3f2-b6abcbd9727e',
        name: 'Ближнього радіусу дії',
        description: 'До 1000 км',
    },
    {
        id: 'f9331dec-acec-40a8-8263-049bcf060eee',
        classId: EXPLOSIVE_OBJECT_CLASS.RANGE,
        parentId: '747a05ec-2c53-475f-b3f2-b6abcbd9727e',
        name: 'Середнього радіусу дії',
        description: 'Від 1000 до 3000 км',
    },
    {
        id: '6c0bafc3-3dcf-4199-ab8d-9c1831ae133c',
        classId: EXPLOSIVE_OBJECT_CLASS.RANGE,
        parentId: '747a05ec-2c53-475f-b3f2-b6abcbd9727e',
        name: 'Понад-середньої дальності',
        description: 'Від 3000 до 5500 кm',
    },
    {
        id: '00754de1-61ae-4d81-a9ff-1247579f2191',
        classId: EXPLOSIVE_OBJECT_CLASS.RANGE,
        parentId: '747a05ec-2c53-475f-b3f2-b6abcbd9727e',
        name: 'Міжконтинентальні',
        description: 'Понад 5500 км',
    },
];

export const rocketEngineData: IExplosiveObjectClassDB[] = [];

// TODO: https://brahmos.com/ru-content.php?id=10&sid=9
/**
394f8943-bbe4-4966-ab71-0fe2b0a33322
8433b640-2121-49d2-9492-32da6f54c8bb
3b9a0201-5d91-4760-9281-b4ae292d2aa4
0cbbd1b7-037e-45ba-a0d0-2a28ac812b1d
2069fa86-0feb-4acf-830b-5255318286db
5687c43e-49f9-4781-9e11-b8a6ad3dfb4b
74dedcf9-8e48-4fd5-8f28-b7793fcf70b1
1bfbb2ef-f32e-4db7-b5e2-c7140172ea63
66d14c5e-c10e-48c2-bd3c-2d945fc0f907
cb97b4c7-a165-4fc2-a27c-b4f629bd9a37
2f1d6346-ceba-41e6-8534-414883eec63d
581d1910-ede9-4527-802b-7e39dee81b8b
064d87a4-80b8-4523-95e3-662511b0a533
*/
export const rocketDataItems = [...rocketTrajectoryData, ...rocketSpeedCruiseData, ...rocketClassData, ...rocketRangeBallisticData];
