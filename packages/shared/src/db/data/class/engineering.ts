import { EXPLOSIVE_OBJECT_CLASS, EXPLOSIVE_OBJECT_TYPE, EXPLOSIVE_OBJECT_COMPONENT } from '../../enum';

export const engineeringClassData = [
    {
        id: 'f3887427-71d6-4965-a87b-80943d186f39',
        class: EXPLOSIVE_OBJECT_CLASS.PURPOSE,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        typeId: EXPLOSIVE_OBJECT_TYPE.ENGINEERING,
        name: 'За призначенням',
    },
    {
        id: 'a5168dbd-988a-4318-9cbe-6e300243d979',
        class: EXPLOSIVE_OBJECT_CLASS.METHOD,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        typeId: EXPLOSIVE_OBJECT_TYPE.ENGINEERING,
        name: 'За способом ураження',
    },
    {
        id: '88e5c873-a826-4e53-bd48-0ed1a74c1e63',
        class: EXPLOSIVE_OBJECT_CLASS.FRAGMENTATION,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        typeId: EXPLOSIVE_OBJECT_TYPE.ENGINEERING,
        name: 'За зоною розльоту осколків',
    },
];

export const engineeringPurposeData = [
    {
        id: '65fe334d-f4fb-496d-a860-efbab90a89cc',
        classId: 'f3887427-71d6-4965-a87b-80943d186f39',
        parentId: null,
        name: 'Протитанковий',
    },
    {
        id: '2d946f0f-d335-4ea9-8aac-52230d1a55a0',
        classId: 'f3887427-71d6-4965-a87b-80943d186f39',
        parentId: '65fe334d-f4fb-496d-a860-efbab90a89cc',
        name: 'Протигусинечний',
    },
    {
        id: '501f82ae-1832-4929-948c-e3c7eeb492c8',
        classId: 'f3887427-71d6-4965-a87b-80943d186f39',
        parentId: '65fe334d-f4fb-496d-a860-efbab90a89cc',
        name: 'Протиднищевий',
    },
    {
        id: '9adb8f38-d50b-480c-9fd6-50a6f5372d10',
        classId: 'f3887427-71d6-4965-a87b-80943d186f39',
        parentId: '65fe334d-f4fb-496d-a860-efbab90a89cc',
        name: 'Протибортовий',
    },
    {
        id: '4f5fe731-3b10-42e3-b7de-f7ff686859ce',
        classId: 'f3887427-71d6-4965-a87b-80943d186f39',
        parentId: null,
        name: 'Протипіхотний',
    },
    {
        id: 'c510374b-0d7c-48f1-abaf-7d088ee9c181',
        classId: 'f3887427-71d6-4965-a87b-80943d186f39',
        parentId: null,
        name: 'Протитранспортні',
    },
    {
        id: '9d4ff5eb-3d37-4429-862a-19217aa1d560',
        classId: 'f3887427-71d6-4965-a87b-80943d186f39',
        parentId: null,
        name: 'Протидесантні',
    },
    {
        id: '87217edb-a1b5-416e-8505-a42f3cc48900',
        classId: 'f3887427-71d6-4965-a87b-80943d186f39',
        parentId: null,
        name: "Об'єктні",
    },
    {
        id: 'e9903e9f-5751-4271-b4e2-74542abdc483',
        classId: 'f3887427-71d6-4965-a87b-80943d186f39',
        parentId: null,
        name: 'Спеціальні',
    },
];

export const engineeringMethodData = [
    {
        id: '122dbdd7-6d17-4982-b5fc-6af5063eda35',
        classId: 'a5168dbd-988a-4318-9cbe-6e300243d979',
        parentId: '4f5fe731-3b10-42e3-b7de-f7ff686859ce',
        name: 'Осколковий',
    },
    {
        id: 'f7b23c44-1699-4f2b-ad02-9f86c25a467f',
        classId: 'a5168dbd-988a-4318-9cbe-6e300243d979',
        parentId: '122dbdd7-6d17-4982-b5fc-6af5063eda35',
        name: 'Кругового розльоту',
    },
    {
        id: 'a51d4684-b5df-42eb-93b2-93cf06f9bcb3',
        classId: 'a5168dbd-988a-4318-9cbe-6e300243d979',
        parentId: '122dbdd7-6d17-4982-b5fc-6af5063eda35',
        name: 'Направленного розльоту',
    },
    {
        id: '336b7313-fc8a-44a1-a417-6b66e2e0c86e',
        classId: 'a5168dbd-988a-4318-9cbe-6e300243d979',
        parentId: '4f5fe731-3b10-42e3-b7de-f7ff686859ce',
        name: 'Фугасний',
    },
];

export const engineeringDataItems = [...engineeringPurposeData, ...engineeringMethodData];
