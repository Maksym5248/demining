import { type ISectionInfoDTO, type IFieldDTO } from '~/api';

export interface IRangeData {
    min: number | null;
    max: number | null;
}

export type IFieldData = IFieldDTO;
export type ISectionInfoData = ISectionInfoDTO;
