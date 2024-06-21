import { RANKS, EMPLOYEE_TYPE, TRANSPORT_TYPE, EQUIPMENT_TYPE, MISSION_REQUEST_TYPE } from 'shared-my/db';
import { dates } from 'shared-my-client/common';

export const mockEmployees = [
    {
        firstName: 'Андрій',
        lastName: 'Кочан',
        surname: 'Юрійович',
        rankId: RANKS.COLONEL,
        type: EMPLOYEE_TYPE.CHIEF,
        position: 'Начальник Мобільного рятувального центру швидкого реагування Державної служби України з надзвичайних ситуацій',
    },
    {
        firstName: 'Максим',
        lastName: 'Костін',
        surname: 'Юрійович',
        rankId: RANKS.SENIOR_LIEUTENANT,
        type: EMPLOYEE_TYPE.SQUAD_LEAD,
        position: 'Начальник відділення',
    },
    {
        firstName: 'Ян',
        lastName: 'Пушкар',
        surname: 'Іванович',
        rankId: RANKS.SENIOR_LIEUTENANT,
        type: EMPLOYEE_TYPE.SQUAD_LEAD,
        position: 'Начальник відділення',
    },
    {
        firstName: 'Руслан',
        lastName: 'Данчук',
        surname: 'Іванович',
        rankId: RANKS.MASTER_SERGEANT,
        type: EMPLOYEE_TYPE.WORKER,
        position: 'Старший сапер',
    },
    {
        firstName: 'Віталій',
        lastName: 'Клименко',
        surname: 'Васильович',
        rankId: RANKS.MASTER_SERGEANT,
        type: EMPLOYEE_TYPE.WORKER,
        position: 'Cапер',
    },
    {
        firstName: 'Ігор',
        lastName: 'Кондратюк',
        surname: 'Ігорович',
        rankId: RANKS.SERGEANT,
        type: EMPLOYEE_TYPE.WORKER,
        position: 'Водій',
    },
];

export const mockMissionRequest = [
    {
        number: '1',
        signedAt: dates.create(Date.now()).subtract(5, 'day'),
        type: MISSION_REQUEST_TYPE.APPLICATION,
    },
    {
        number: '2',
        signedAt: dates.create(Date.now()).subtract(4, 'day'),
        type: MISSION_REQUEST_TYPE.APPLICATION,
    },
    {
        number: '3',
        signedAt: dates.create(Date.now()).subtract(3, 'day'),
        type: MISSION_REQUEST_TYPE.APPLICATION,
    },
    {
        number: '4',
        signedAt: dates.create(Date.now()).subtract(2, 'day'),
        type: MISSION_REQUEST_TYPE.CONTRACT,
    },
    {
        number: '5',
        signedAt: dates.create(Date.now()).subtract(1, 'day'),
        type: MISSION_REQUEST_TYPE.LETTER,
    },
];

export const mockTransport = [
    {
        name: 'Toyota Hilux',
        number: 'КА 706 Е',
        type: TRANSPORT_TYPE.FOR_HUMANS,
    },
    {
        name: 'Toyota Land Cruiser',
        number: 'КА 645 Е',
        type: TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS,
    },
    {
        name: 'Toyota Hilux 2',
        number: 'КА 7062 Е',
        type: TRANSPORT_TYPE.FOR_HUMANS,
    },
    {
        name: 'Toyota Land Cruiser 2',
        number: 'КА 6452 Е',
        type: TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS,
    },
];

export const mockEquipment = [
    {
        name: 'Minelab F3',
        type: EQUIPMENT_TYPE.MINE_DETECTOR,
    },
];
