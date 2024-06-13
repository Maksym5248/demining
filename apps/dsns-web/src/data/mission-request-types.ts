import { MISSION_REQUEST_TYPE } from '~/constants';

export const missionRequestType = [
    {
        name: 'Заявка',
        value: MISSION_REQUEST_TYPE.APPLICATION,
    },
    {
        name: 'Лист',
        value: MISSION_REQUEST_TYPE.LETTER,
    },
    {
        name: 'Договір',
        value: MISSION_REQUEST_TYPE.CONTRACT,
    },
];
