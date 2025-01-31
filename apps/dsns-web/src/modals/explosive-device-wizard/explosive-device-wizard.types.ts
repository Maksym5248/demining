import { type EXPLOSIVE_DEVICE_TYPE } from 'shared-my';
import { type ISizeData, type IFillerData } from 'shared-my-client';

export interface IExplosiveDeviceForm {
    name: string;
    type: EXPLOSIVE_DEVICE_TYPE;
    imageUri: string | null;
    imageUris: string[] | null;
    filler: IFillerData[] | null;
    size: ISizeData | null;
    chargeWeight: number | null;

    purposeImageUris: string[];
    purposeDescription: string;

    structureImageUris: string[];
    structureDescription: string;

    actionImageUris: string[];
    actionDescription: string;
}
