import { EXPLOSIVE_OBJECT_GROUP, EXPLOSIVE_OBJECT_COMPONENT, EXPLOSIVE_OBJECT_CLASS } from '../../enum';
import { type IExplosiveObjectClassItemDB, type IExplosiveObjectClassDB } from '../../types';

export const rocketClassData: IExplosiveObjectClassDB[] = [
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
        id: '394f8943-bbe4-4966-ab71-0fe2b0a33322',
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
        classId: 'f3887427-71d6-4965-a87b-80943d186f39',
        parentId: null,
        name: 'Крилата',
        description: 'Ракета з керованим двигуном',
    },
    {
        id: '747a05ec-2c53-475f-b3f2-b6abcbd9727e',
        classId: 'f3887427-71d6-4965-a87b-80943d186f39',
        parentId: null,
        name: 'Балістична',
        description: 'Ракета яка має бальстичну траєкторію на більшій частині польоту',
    },
];

export const rocketSpeedCruiseData: IExplosiveObjectClassItemDB[] = [
    {
        id: 'ba75f2b7-1043-422c-9c06-a8d34c9f51dd',
        classId: '2f510177-89bf-457b-a738-17b98212d8b4',
        parentId: '10c7690a-e0ca-4f80-8e76-ad4a5aeb5b19',
        name: 'Дозвукова',
        description: 'Швидкість польоту ракети менше швидкості звукуб до 0.8 маха',
    },
    {
        id: 'd7311cd1-7203-4762-855b-e0b272cb4b93',
        classId: '2f510177-89bf-457b-a738-17b98212d8b4',
        parentId: '10c7690a-e0ca-4f80-8e76-ad4a5aeb5b19',
        name: 'Надзвукова',
        description: 'Швидкість польоту ракети більше швидкості звуку, 2-3 маха',
    },
    {
        id: '9307de6f-7f9c-4d3a-b8b0-3cd0b75e14b7',
        classId: '2f510177-89bf-457b-a738-17b98212d8b4',
        parentId: '10c7690a-e0ca-4f80-8e76-ad4a5aeb5b19',
        name: 'Гіперзвукова',
        description: 'Швидкість польоту ракети більше швидкості звуку, більше 5 махів',
    },
];

export const rocketClassDataItems: IExplosiveObjectClassItemDB[] = [
    {
        id: 'fdc97624-ff39-4530-94df-4c817f04adb9',
        classId: '8d8cf76f-cf39-4b42-85a8-0176da849203',
        parentId: null,
        name: 'Земля-земля',
    },
    {
        id: 'cb3fbeb3-7499-4ae4-bd8c-fd7808eda3e8',
        classId: '8d8cf76f-cf39-4b42-85a8-0176da849203',
        parentId: null,
        name: 'Земля-повітря',
    },
    {
        id: '88703139-aeec-4bdf-96a9-036298097ce7',
        classId: '8d8cf76f-cf39-4b42-85a8-0176da849203',
        parentId: null,
        name: 'Земля-море',
    },
    {
        id: '7cb1a9d2-6bdd-4b79-84fb-a6f1948b62f1',
        classId: '8d8cf76f-cf39-4b42-85a8-0176da849203',
        parentId: null,
        name: 'Повітря-повітря',
    },
    {
        id: '1060c1c3-6ed4-4212-8ec0-5ed1f23506e4',
        classId: '8d8cf76f-cf39-4b42-85a8-0176da849203',
        parentId: null,
        name: 'Повітря-поверхня (земля, вода)',
    },
    {
        id: 'b678dd94-06a5-4e81-9901-a4b59ff3511d',
        classId: '8d8cf76f-cf39-4b42-85a8-0176da849203',
        parentId: null,
        name: 'Море-море',
    },
    {
        id: '876db432-c7d5-45af-a746-9857347b82ed',
        classId: '8d8cf76f-cf39-4b42-85a8-0176da849203',
        parentId: null,
        name: 'Море-земля',
    },

    // протитанкові
];

export const rocketRangeBallisticData: IExplosiveObjectClassItemDB[] = [
    {
        id: 'f4b59cba-9f9a-41cd-ba8b-26e2db3d2f7e',
        classId: '394f8943-bbe4-4966-ab71-0fe2b0a33322',
        parentId: '747a05ec-2c53-475f-b3f2-b6abcbd9727e',
        name: 'Ближнього радіусу дії',
        description: 'До 1000 км',
    },
    {
        id: 'f9331dec-acec-40a8-8263-049bcf060eee',
        classId: '394f8943-bbe4-4966-ab71-0fe2b0a33322',
        parentId: '747a05ec-2c53-475f-b3f2-b6abcbd9727e',
        name: 'Середнього радіусу дії',
        description: 'Від 1000 до 3000 км',
    },
    {
        id: '6c0bafc3-3dcf-4199-ab8d-9c1831ae133c',
        classId: '394f8943-bbe4-4966-ab71-0fe2b0a33322',
        parentId: '747a05ec-2c53-475f-b3f2-b6abcbd9727e',
        name: 'Понад-середньої дальності',
        description: 'Від 3000 до 5500 кm',
    },
    {
        id: '00754de1-61ae-4d81-a9ff-1247579f2191',
        classId: '394f8943-bbe4-4966-ab71-0fe2b0a33322',
        parentId: '747a05ec-2c53-475f-b3f2-b6abcbd9727e',
        name: 'Міжконтинентальні',
        description: 'Понад 5500 км',
    },
];

export const rocketEngineData: IExplosiveObjectClassItemDB[] = [
    {
        id: '8433b640-2121-49d2-9492-32da6f54c8bb',
        classId: 'a2690948-3e21-4645-a3e2-746411209b4e',
        parentId: null,
        name: 'Твердопаливний',
    },
    {
        id: '3b9a0201-5d91-4760-9281-b4ae292d2aa4',
        classId: 'a2690948-3e21-4645-a3e2-746411209b4e',
        parentId: null,
        name: 'Рідкопаливний',
    },
    {
        id: '0cbbd1b7-037e-45ba-a0d0-2a28ac812b1d',
        classId: 'a2690948-3e21-4645-a3e2-746411209b4e',
        parentId: null,
        name: 'Гібридний',
    },
    {
        id: '2069fa86-0feb-4acf-830b-5255318286db',
        classId: 'a2690948-3e21-4645-a3e2-746411209b4e',
        parentId: null,
        name: 'Прямоточний повітряно-реактивний',
    },
    {
        id: '5687c43e-49f9-4781-9e11-b8a6ad3dfb4b',
        classId: 'a2690948-3e21-4645-a3e2-746411209b4e',
        parentId: null,
        name: 'Прямоточний повітряно-реактивний з надзвуковим горінням',
    },
    {
        id: '5687c43e-49f9-4781-9e11-b8a6ad3dfb4b',
        classId: 'a2690948-3e21-4645-a3e2-746411209b4e',
        parentId: null,
        name: 'Кріогенний',
    },
];

export const rocketChargeData: IExplosiveObjectClassItemDB[] = [
    {
        id: '1bfbb2ef-f32e-4db7-b5e2-c7140172ea63',
        classId: '852257d8-13ad-472c-b3db-39e4c8112ce1',
        parentId: null,
        name: 'Звичайна',
    },
    {
        id: '66d14c5e-c10e-48c2-bd3c-2d945fc0f907',
        classId: '852257d8-13ad-472c-b3db-39e4c8112ce1',
        parentId: null,
        name: 'Ядерна',
    },
];

export const rocketTargitingSystemData: IExplosiveObjectClassItemDB[] = [
    {
        id: 'cb97b4c7-a165-4fc2-a27c-b4f629bd9a37',
        classId: '428f998e-58db-4c92-8884-10f938aaee21',
        parentId: null,
        name: 'Електродистанційне',
    },
    {
        id: '2f1d6346-ceba-41e6-8534-414883eec63d',
        classId: '428f998e-58db-4c92-8884-10f938aaee21',
        parentId: null,
        name: 'Командне',
    },
    {
        id: '064d87a4-80b8-4523-95e3-662511b0a533',
        classId: '428f998e-58db-4c92-8884-10f938aaee21',
        parentId: null,
        name: 'По наземним орієнтирам',
    },
    {
        id: '494a3334-38a1-4878-a4f6-87c28286a174',
        classId: '428f998e-58db-4c92-8884-10f938aaee21',
        parentId: null,
        name: 'Геофізичне',
    },
    {
        id: '72338c51-f462-4790-af16-b122cd4adb6d',
        classId: '428f998e-58db-4c92-8884-10f938aaee21',
        parentId: null,
        name: 'Інерційне наведення',
    },
    {
        id: '72338c51-f462-4790-af16-b122cd4adb6d',
        classId: '428f998e-58db-4c92-8884-10f938aaee21',
        parentId: null,
        name: 'За променем',
    },
    {
        id: '0184e8fe-c78d-4df9-9df6-dafeadd172cb',
        classId: '428f998e-58db-4c92-8884-10f938aaee21',
        parentId: null,
        name: 'Лазерене',
    },
    {
        id: '0184e8fe-c78d-4df9-9df6-dafeadd172cb',
        classId: '428f998e-58db-4c92-8884-10f938aaee21',
        parentId: null,
        name: 'Радіочастотне та супутникове',
    },
];

/**
 *  source  https://brahmos.com/ru-content.php?id=10&sid=9
 * */

export const rocketDataItems = [
    ...rocketTrajectoryData,
    ...rocketSpeedCruiseData,
    ...rocketClassDataItems,
    ...rocketRangeBallisticData,
    ...rocketEngineData,
    ...rocketChargeData,
    ...rocketTargitingSystemData,
];
