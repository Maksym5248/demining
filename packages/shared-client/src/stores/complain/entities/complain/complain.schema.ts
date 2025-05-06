import { type Dayjs } from 'dayjs';
import { type COMPLAIN_TYPE } from 'shared-my';

import { type IComplainCreateParamsDTO, type IComplainDTO } from '~/api';
import { type ICreateValue } from '~/common';

export interface IComplainData {
    id: string;
    text: string;
    type: COMPLAIN_TYPE;
    authorId: string;
    entityId: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export type ICreateComplainData = Pick<IComplainData, 'text' | 'type' | 'entityId'>;

export const createComplainDTO = (value: ICreateValue<IComplainDTO>): ICreateValue<IComplainCreateParamsDTO> => ({
    text: value.text ?? null,
    type: value.type,
    entityId: value.entityId,
    originalLang: value.originalLang,
});
