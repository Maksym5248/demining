import { type EXPLOSIVE_OBJECT_STATUS, type EXPLOSIVE_DEVICE_TYPE } from 'shared-my';
import { type ISizeData, type IFillerData, type IFieldData } from 'shared-my-client';

export interface IExplosiveDeviceForm {
    name: string;
    type: EXPLOSIVE_DEVICE_TYPE;
    imageUri: string | null;
    imageUris: string[] | null;
    filler: IFillerData[] | null;
    size: ISizeData[] | null;
    chargeWeight: number | null;
    status: EXPLOSIVE_OBJECT_STATUS;

    purposeImageUris: string[];
    purposeDescription: string;

    structureImageUris: string[];
    structureDescription: string;

    actionImageUris: string[];
    actionDescription: string;

    additional: IFieldData[];
}
