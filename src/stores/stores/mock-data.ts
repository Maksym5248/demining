import { RANKS, EMPLOYEE_TYPE, TRANSPORT_TYPE, EQUIPMENT_TYPE } from "~/constants"

export const mockEmployees = [{
    firstName: "Андрій",
    lastName: "Кочан",
    surname: "Юрійович",
    rank: RANKS.COLONEL,
    type: EMPLOYEE_TYPE.CHIEF,
    position: "Начальник Мобільного рятувального центру швидкого реагування Державної служби України з надзвичайних ситуацій полковник служби цивільного захисту",
}, {
    firstName: "Максим",
    lastName: "Костін",
    surname: "Юрійович",
    rank: RANKS.SENIOR_LIEUTENANT,
    type: EMPLOYEE_TYPE.SQUAD_LEAD,
    position: "Начальник відділення",
}, {
    firstName: "Ян",
    lastName: "Пушкар",
    surname: "Іванович",
    rank: RANKS.SENIOR_LIEUTENANT,
    type: EMPLOYEE_TYPE.SQUAD_LEAD,
    position: "Начальник відділення",
}, {
    firstName: "Руслан",
    lastName: "Данчук",
    surname: "Іванович",
    rank: RANKS.MASTER_SERGEANT,
    type: EMPLOYEE_TYPE.WORKER,
    position: "Старший сапер",
}, {
    firstName: "Віталій",
    lastName: "Клименко",
    surname: "Васильович",
    rank: RANKS.MASTER_SERGEANT,
    type: EMPLOYEE_TYPE.WORKER,
    position: "Cапер",
}, {
    firstName: "Ігор",
    lastName: "Кондратюк",
    surname: "Ігорович",
    rank: RANKS.SERGEANT,
    type: EMPLOYEE_TYPE.WORKER,
    position: "Водій",
}]


export const mockMissionRequest = [{
    number: 1,
    signedAt: new Date()
},{
    number: 2,
    signedAt: new Date()
},{
    number: 3,
    signedAt: new Date()
},{
    number: 4,
    signedAt: new Date()
},{
    number: 5,
    signedAt: new Date()
}];

export const mockTransport = [{
    name: "Toyota Hilux",
    number: "КА 706 Е",
    type: TRANSPORT_TYPE.FOR_HUMANS,
},{
    name: "Toyota Land Cruiser",
    number: "КА 645 Е",
    type: TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS,
}, {
    name: "Toyota Hilux 2",
    number: "КА 7062 Е",
    type: TRANSPORT_TYPE.FOR_HUMANS,
},{
    name: "Toyota Land Cruiser 2",
    number: "КА 6452 Е",
    type: TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS,
}];

export const mockEquipment = [{
    name: "Minelab F3",
    type: EQUIPMENT_TYPE.MINE_DETECTOR,
},]