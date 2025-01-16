import { type MATERIAL, type EXPLOSIVE_OBJECT_COMPONENT, type EXPLOSIVE_OBJECT_STATUS } from 'shared-my';
import {
    type IActionData,
    type IPurposeData,
    type IStructureData,
    type IFillerData,
    type ISizeData,
    type ITempartureData,
} from 'shared-my-client';

export interface IExplosiveObjectForm {
    name: string;
    status: EXPLOSIVE_OBJECT_STATUS;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    countryId: string;
    typeId: string;
    classItemIds: string[];
    imageUri: string;
    // additional
    image?: File;

    // detail
    material: MATERIAL;
    size: ISizeData | null;
    weight: number | null;
    temperature: ITempartureData | null;

    // TODO:
    filler: IFillerData | null;
    caliber: number | null;
    fuseIds: string[];

    purpose: IPurposeData | null;
    structure: IStructureData | null;
    action: IActionData | null;
}
