import { type IExplosiveCompositionData } from 'shared-my-client';

export interface IExplosiveForm {
    name: string;
    imageUri: string | null;
    fullName: string | null;
    formula: string | null;
    description: string | null;
    composition: IExplosiveCompositionData[] | null;

    //explosive
    velocity: number | null; // m/s
    brisantness: number | null; // мм
    explosiveness: number | null; // см³
    tnt: number | null;

    //sensitivity
    shock: string | null;
    temperature: string | null;
    friction: string | null;

    density: number | null; // г/см3
    meltingPoint: number | null; // °C
    ignitionPoint: number | null; // °C
    image: File | null;
}
