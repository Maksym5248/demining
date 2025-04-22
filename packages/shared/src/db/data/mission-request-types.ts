import { MISSION_REQUEST_TYPE } from '../enum';
import { type IMissionRequestTypeDB } from '../types';

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
