import { EXPLOSIVE_OBJECT_CLASS, EXPLOSIVE_OBJECT_TYPE, EXPLOSIVE_OBJECT_COMPONENT } from '../../enum';
import { type IExplosiveObjectClassItemDB, type IExplosiveObjectClassDB } from '../../types';

export const arteleryClassData: IExplosiveObjectClassDB[] = [
    {
        id: '693e9109-5363-44db-bd93-1109db50f067',
        class: EXPLOSIVE_OBJECT_CLASS.PURPOSE,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        typeId: EXPLOSIVE_OBJECT_TYPE.ARTELERY_SHELL,
        name: 'За призначенням',
    },
    {
        id: '18b18d55-08b1-4d26-afcb-5d4fbb52e25d',
        class: EXPLOSIVE_OBJECT_CLASS.CALIBER,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        typeId: EXPLOSIVE_OBJECT_TYPE.ARTELERY_SHELL,
        name: 'За калібром',
    },
    {
        id: 'e298c279-784c-4c71-b3d0-046391008b54',
        class: EXPLOSIVE_OBJECT_CLASS.CALIBER_TO_GUN,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        typeId: EXPLOSIVE_OBJECT_TYPE.ARTELERY_SHELL,
        name: 'По відношенню калібру снаряда до калібру гармати',
    },
    {
        id: '7471d2da-b6ac-467a-9e86-0c8055617db3',
        class: EXPLOSIVE_OBJECT_CLASS.OUTER_COUNTUR,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        typeId: EXPLOSIVE_OBJECT_TYPE.ARTELERY_SHELL,
        name: 'За зовнішнім контуром',
    },
    {
        id: '32f6011b-ec3f-41b5-ac06-a66ddb5ee7be',
        class: EXPLOSIVE_OBJECT_CLASS.STABILIZATION,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        typeId: EXPLOSIVE_OBJECT_TYPE.ARTELERY_SHELL,
        name: 'За способом стабілізації',
    },
    {
        id: '32f6011b-ec3f-41b5-ac06-a66ddb5ee7be',
        class: EXPLOSIVE_OBJECT_CLASS.CHARGING,
        component: EXPLOSIVE_OBJECT_COMPONENT.AMMO,
        typeId: EXPLOSIVE_OBJECT_TYPE.ARTELERY_SHELL,
        name: 'За способом заряджання',
    },
];

export const arteleryPurposeData: IExplosiveObjectClassItemDB[] = [
    {
        id: '8456715e-485a-4e02-b52d-4c55fefb24f3',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: null,
        name: 'Основного',
    },
    {
        id: 'fc2c2e24-4e01-45b9-9654-89e29b884559',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: null,
        name: 'Спеціального',
    },
    {
        id: '6f31cd50-5ae9-4373-b862-6c8d9f1623f8',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: null,
        name: 'Допоміжного',
    },
    {
        id: 'cecf98db-0078-4763-b247-d1c06339bc31',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: '8456715e-485a-4e02-b52d-4c55fefb24f3',
        name: 'Фугасний',
    },
    {
        id: '3a18857d-e77c-4798-a6f6-1e1b7fd35443',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: '8456715e-485a-4e02-b52d-4c55fefb24f3',
        name: 'Осколковий',
    },
    {
        id: '4324fcc4-68af-4a8c-8019-415a06e1365d',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: '8456715e-485a-4e02-b52d-4c55fefb24f3',
        name: 'Осколково-фугасний',
    },
    {
        id: '92b86b98-48cb-4844-af35-6ed6ee6f1ed3',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: '8456715e-485a-4e02-b52d-4c55fefb24f3',
        name: 'Запалювальний',
    },
    {
        id: '5ed8f869-fc42-4db3-bf31-44441eca5561',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: '8456715e-485a-4e02-b52d-4c55fefb24f3',
        name: 'Бронебійний',
    },
    {
        id: '8d18ab65-cfab-4b7c-8543-f4436edbaa4d',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: '8456715e-485a-4e02-b52d-4c55fefb24f3',
        name: 'Бетонобійний',
    },
    {
        id: 'ba081764-be54-421e-b362-7e381b7b024a',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: '8456715e-485a-4e02-b52d-4c55fefb24f3',
        name: 'Кумулятивний',
    },
    {
        id: '36239edf-96e3-47c2-80f4-dab79d8e006a',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: '8456715e-485a-4e02-b52d-4c55fefb24f3',
        name: 'Хімічний',
    },
    {
        id: '5e45ef28-fc61-4f8c-808c-52f79bb34322',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: 'fc2c2e24-4e01-45b9-9654-89e29b884559',
        name: 'Освітлювальний',
    },
    {
        id: '196ba2b1-560c-4247-8bed-0ce6741a686c',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: 'fc2c2e24-4e01-45b9-9654-89e29b884559',
        name: 'Димовий',
    },
    {
        id: 'c28c1acb-5938-4afe-bb70-9ad923166b5e',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: 'fc2c2e24-4e01-45b9-9654-89e29b884559',
        name: 'Агітаційний',
    },
    {
        id: '9765857a-ff36-4566-bbba-ad003bc8115a',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: 'fc2c2e24-4e01-45b9-9654-89e29b884559',
        name: 'Сигнальні',
    },
    {
        id: '5bf147f5-dc8d-41ed-b048-fb46ac93ce5c',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: 'fc2c2e24-4e01-45b9-9654-89e29b884559',
        name: 'Пристрілочні',
    },
    {
        id: 'd0cce19a-53d6-497b-9038-007be083663c',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: '6f31cd50-5ae9-4373-b862-6c8d9f1623f8',
        name: 'Учбові',
    },
    {
        id: 'd792bb18-f0f0-414f-837d-9a52e578cf80',
        classId: '693e9109-5363-44db-bd93-1109db50f067',
        parentId: '6f31cd50-5ae9-4373-b862-6c8d9f1623f8',
        name: 'Практичні',
    },
];

export const arteleryCaliberData: IExplosiveObjectClassItemDB[] = [
    {
        id: '5a19e080-8931-4269-8fd8-13567d5b26e1',
        classId: '18b18d55-08b1-4d26-afcb-5d4fbb52e25d',
        parentId: null,
        name: 'Малий',
        description: 'менше 76 мм',
    },
    {
        id: '9002125a-8c17-4edf-bf9e-2f935a519d0b',
        classId: '18b18d55-08b1-4d26-afcb-5d4fbb52e25d',
        parentId: null,
        name: 'Середній',
        description: '76 – 152 мм',
    },
    {
        id: '85a13b52-7b8b-4983-8174-c412cc954910',
        classId: '18b18d55-08b1-4d26-afcb-5d4fbb52e25d',
        parentId: null,
        name: 'Великий',
        description: 'більше 152 мм',
    },
];

export const arteleryCaliberToGunData: IExplosiveObjectClassItemDB[] = [
    {
        id: 'a46f81db-dd2e-4268-9ea1-e32176725e50',
        classId: 'e298c279-784c-4c71-b3d0-046391008b54',
        parentId: null,
        name: 'Надкаліберний',
    },
    {
        id: '39c48bec-acb8-44f7-a3da-c10651cf07be',
        classId: 'e298c279-784c-4c71-b3d0-046391008b54',
        parentId: null,
        name: 'Каліберний',
    },
    {
        id: '8d50e5e3-5303-44b7-b24e-8a9734e105a3',
        classId: 'e298c279-784c-4c71-b3d0-046391008b54',
        parentId: null,
        name: 'Підкаліберний',
    },
];

export const arteleryOuterConturData: IExplosiveObjectClassItemDB[] = [
    {
        id: 'dce27b89-5ec7-4a5b-b5b5-f98ea1020800',
        classId: '7471d2da-b6ac-467a-9e86-0c8055617db3',
        parentId: null,
        name: 'Далекобійні',
        description: 'подовжена головна частина, коротка циліндрична і циліндро-конічна запояскова частини снаряда',
    },
    {
        id: 'aefe9ad2-eb3d-42bd-9daf-948b3c5d0706',
        classId: '7471d2da-b6ac-467a-9e86-0c8055617db3',
        parentId: null,
        name: 'Недалекобійні',
        description: 'коротка головна і довга циліндрова частині снаряда',
    },
];

export const arteleryStabilizationData: IExplosiveObjectClassItemDB[] = [
    {
        id: 'dce27b89-5ec7-4a5b-b5b5-f98ea1020800',
        classId: '32f6011b-ec3f-41b5-ac06-a66ddb5ee7be',
        parentId: null,
        name: 'Обертові',
        description: 'Cтабілізуються у польоті за рахунок доданого їм швидкого обертального руху',
    },
    {
        id: 'aefe9ad2-eb3d-42bd-9daf-948b3c5d0706',
        classId: '32f6011b-ec3f-41b5-ac06-a66ddb5ee7be',
        parentId: null,
        name: 'Необертові',
        description: 'Cтабілізуються у польоті за рахунок стабілізуючого пристрою у вигляді оперення',
    },
];

export const arteleryChargingData: IExplosiveObjectClassItemDB[] = [
    {
        id: '1c272f2b-0d29-49c5-b1f4-fcacecc43ac1',
        classId: '32f6011b-ec3f-41b5-ac06-a66ddb5ee7be',
        parentId: null,
        name: 'Унітарні',
        description: 'Cнаряд і заряд знаходяться в одному корпусі.',
    },
    {
        id: 'ecfdbfb2-a1c2-4e26-ae11-032c7d57c13f',
        classId: '32f6011b-ec3f-41b5-ac06-a66ddb5ee7be',
        parentId: null,
        name: 'Роздільно-гільзові',
        description: 'Заряд знаходиться в металевій гільзі, яка вставляється після снаряда.',
    },
    {
        id: '4779bdae-6cb8-4146-abc2-f328b377e879',
        classId: '32f6011b-ec3f-41b5-ac06-a66ddb5ee7be',
        parentId: null,
        name: 'Роздільно-картузні',
        description: "Пороховий заряд міститься в тканинному або іншому м'якому контейнері (картузі)",
    },
];

export const arteleryDataItems = [
    ...arteleryPurposeData,
    ...arteleryCaliberData,
    ...arteleryCaliberToGunData,
    ...arteleryStabilizationData,
    ...arteleryChargingData,
];

// 65a50b9b-805c-4b59-b466-9d754f6893ff
// e095a6de-0aae-405c-a92f-14eff27050b2
// d6adcc4a-0fd7-419c-9257-326ae1c5ae51
// 7f0a5c71-93d1-472c-b8d3-d08be4e23afa
// 7a34a888-c8c7-4679-a9a5-f7130e2f6b20
// f839cb13-f008-44ce-91e3-b321bd237133
// 01bde4ea-ea23-4011-abc9-cd2075e4e1f6
// 5cb87d90-ac52-4229-828a-4247c6c8830c
// 6592ba77-781f-48ec-8063-1488964bcd86
// b9bc1ace-8510-495e-8659-ff3189f76842
// 04fc0a37-508c-426b-9418-78cc9f3fdc0a
// a8792d36-4b95-4be2-bcdc-0add8fed1f05
// 6f738d3c-3e70-4aca-b24b-0ab03a73350f
// 9427b309-8f41-401e-8f88-e47f0eeb5092
// 0a641f18-84a6-4d78-a512-ee76c4b1bcd8
// 3ac7b78c-0dce-4755-ae03-4cb6066fa101
// a27c907d-b638-44ef-9d91-418cf0cb7d85
// cd7c27e9-50ef-43de-acde-3a8bcccb7163
// c8616e77-0e00-4503-a306-1931f9d6dbdb
// c22b4cca-9813-4ce4-81be-2669cc4e1cf2
// 83df382d-0ddc-4f75-8ccd-c067aab01da6
// e97f7c2c-bc26-4a21-9151-c7f05de2d4a1
// 96c6cf93-1d26-4000-bf9a-7ad600b4f59e
// 77c75a4b-f0ca-43d0-a0b9-c0258a269c0d
// 26345099-ba31-48e2-9453-6b60aa8ee81c
// 451d0076-5f99-4ce3-ae8e-024637099805
// 585ec7b5-6e19-4935-870c-a0f4d0006173
// 5dd1cf02-0555-4cc2-bec0-8ebdff042bf4
// 649345f9-00ea-4fc0-b6d9-5f75e45dcae4
// d038294c-00d5-4673-8e17-71248c154aaa
// b1da708f-1bb0-4c2e-83c4-7b3c00965cbf
// b73da76a-dca2-451f-b4ea-ac66e9ae7d9a
// 2a8006d6-4cbc-4d90-80b2-6949ca7364f2
// 54fd14cb-7e61-42ce-a612-4db0ff6203f3
// 88ad3eda-e0b8-4ac7-86df-815f60b23476
// 09438875-95f4-4954-a694-46b4bd375471
// 226b62bd-8d51-49a3-af79-3498718d3430
// 51d8f579-500f-429f-b027-646aba5efc7d
// 22bbc86c-6916-4088-a92a-82f2e9d80b21
