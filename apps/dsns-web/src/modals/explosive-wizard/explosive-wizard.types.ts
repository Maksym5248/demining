import { type IExplosiveСompositionData } from 'shared-my-client';

export interface IExplosiveForm {
    name: string;
    imageUri: string | null;
    fullName: string | null;
    formula: string | null;
    description: string | null;
    composition: IExplosiveСompositionData[] | null;
    detonation: {
        velocity: number | null; // m/s
    } | null;
    sensitivity: {
        shock: string | null;
        tempurture: string | null;
    } | null;
    density: number | null; // г/см3
    image: File | null;
}
