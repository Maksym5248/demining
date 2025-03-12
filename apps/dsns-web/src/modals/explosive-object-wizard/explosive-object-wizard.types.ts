import { type MATERIAL, type EXPLOSIVE_OBJECT_COMPONENT, type EXPLOSIVE_OBJECT_STATUS } from 'shared-my';
import { type IFieldData, type IFillerData, type ISizeData, type ITempartureData } from 'shared-my-client';

export interface IExplosiveObjectForm {
    name: string;
    fullName: string | null;
    description: string | null;
    fullDescription: string | null;

    status: EXPLOSIVE_OBJECT_STATUS;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    countryId: string;
    typeId: string;
    classItemIds: string[];
    imageUri: string;

    // detail
    imageUris: string[] | null;
    material: MATERIAL[];
    size: ISizeData[] | null;
    weight: number[] | null;
    temperature: ITempartureData | null;
    targetSensor: string | null; // датчик цілі
    sensitivity: string | null; // чутливість
    timeWork: string | null; // час роботи

    filler: IFillerData[] | null;
    caliber: number | null;
    fuseIds: string[];
    fervorIds: string[];
    liquidatorShort: string | null;
    foldingShort: string | null;
    extractionShort: string | null;
    damage: string | null;

    purposeImageUris: string[];
    purposeDescription: string;

    structureImageUris: string[];
    structureDescription: string;

    actionImageUris: string[];
    actionDescription: string;

    liquidatorImageUris: string[];
    liquidatorDescription: string;

    extractionImageUris: string[];
    extractionDescription: string;

    foldingImageUris: string[];
    foldingDescription: string;

    installationImageUris: string[];
    installationDescription: string;

    neutralizationImageUris: string[];
    neutralizationDescription: string;

    markingImageUris: string[];
    markingDescription: string;

    historicalImageUris: string[];
    historicalDescription: string;

    additional: IFieldData[];

    // additional
    image?: File;
}
