import { EXPLOSIVE_OBJECT_CLASS, EXPLOSIVE_OBJECT_TYPE, EXPLOSIVE_OBJECT_COMPONENT } from '../../enum';
import { type IExplosiveObjectClassItemDB, type IExplosiveObjectClassDB } from '../../types';

export const engineeringClassData: IExplosiveObjectClassDB[] = [
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

export const engineeringPurposeData: IExplosiveObjectClassItemDB[] = [
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

export const engineeringMethodData: IExplosiveObjectClassItemDB[] = [
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

/*
e5a4f804-90ee-43fd-ae1c-8841bf9c9035
cecf98db-0078-4763-b247-d1c06339bc31
693e9109-5363-44db-bd93-1109db50f067
3a18857d-e77c-4798-a6f6-1e1b7fd35443
4324fcc4-68af-4a8c-8019-415a06e1365d
8456715e-485a-4e02-b52d-4c55fefb24f3
fc2c2e24-4e01-45b9-9654-89e29b884559
6f31cd50-5ae9-4373-b862-6c8d9f1623f8
18b18d55-08b1-4d26-afcb-5d4fbb52e25d
e298c279-784c-4c71-b3d0-046391008b54
7471d2da-b6ac-467a-9e86-0c8055617db3
32f6011b-ec3f-41b5-ac06-a66ddb5ee7be
5ed8f869-fc42-4db3-bf31-44441eca5561
ba081764-be54-421e-b362-7e381b7b024a
92b86b98-48cb-4844-af35-6ed6ee6f1ed3
8d18ab65-cfab-4b7c-8543-f4436edbaa4d
36239edf-96e3-47c2-80f4-dab79d8e006a
c28c1acb-5938-4afe-bb70-9ad923166b5e
196ba2b1-560c-4247-8bed-0ce6741a686c
5e45ef28-fc61-4f8c-808c-52f79bb34322
5bf147f5-dc8d-41ed-b048-fb46ac93ce5c
fcf1eab4-5112-4548-b985-3bd465f2ace9
9765857a-ff36-4566-bbba-ad003bc8115a
4d178644-8596-4e96-83a3-8faedeb71abe
a46f81db-dd2e-4268-9ea1-e32176725e50
39c48bec-acb8-44f7-a3da-c10651cf07be
8d50e5e3-5303-44b7-b24e-8a9734e105a3
*/
