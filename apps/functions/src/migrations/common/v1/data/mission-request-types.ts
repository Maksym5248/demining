import { type IMissionRequestTypeDB, MISSION_REQUEST_TYPE } from 'shared-my';

export const missionRequestType: Pick<IMissionRequestTypeDB, 'id' | 'name'>[] = [
    {
        name: 'Заявка',
        id: MISSION_REQUEST_TYPE.APPLICATION,
    },
    {
        name: 'Лист',
        id: MISSION_REQUEST_TYPE.LETTER,
    },
    {
        name: 'Договір',
        id: MISSION_REQUEST_TYPE.CONTRACT,
    },
];
