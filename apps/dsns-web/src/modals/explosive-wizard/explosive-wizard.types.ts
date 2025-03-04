import { type EXPLOSIVE_OBJECT_STATUS } from 'shared-my';
import { type IRangeData, type IExplosiveCompositionData, type IFieldData } from 'shared-my-client';

export interface IExplosiveForm {
    name: string;
    imageUri: string | null;
    imageUris: string[] | null;
    fullName: string | null;
    formula: string | null;
    description: string | null;
    composition: IExplosiveCompositionData[] | null;
    status: EXPLOSIVE_OBJECT_STATUS;
    //explosive
    velocity: IRangeData | null; // m/s
    brisantness: IRangeData | null; // m
    explosiveness: IRangeData | null; // m³
    tnt: IRangeData | null; // TNT equivalent

    //sensitivity
    shock: string | null;
    temperature: string | null;
    friction: string | null;

    density: IRangeData | null; // kg/m³
    meltingPoint: IRangeData | null; // °C
    ignitionPoint: IRangeData | null; // °C
    image: File | null;

    additional: IFieldData[];
}
