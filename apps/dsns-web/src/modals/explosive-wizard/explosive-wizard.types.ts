import { type IExplosiveCompositionData } from 'shared-my-client';

export interface IExplosiveForm {
    name: string;
    imageUri: string | null;
    imageUris: string[] | null;
    fullName: string | null;
    formula: string | null;
    description: string | null;
    composition: IExplosiveCompositionData[] | null;

    //explosive
    velocity: number | null; // m/s
    brisantness: number | null; // m
    explosiveness: number | null; // m³
    tnt: number | null; // TNT equivalent

    //sensitivity
    shock: string | null;
    temperature: string | null;
    friction: string | null;

    density: number | null; // kg/m³
    meltingPoint: number | null; // °C
    ignitionPoint: number | null; // °C
    image: File | null;
}
