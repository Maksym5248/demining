export interface IFillerDB {
    name: string | null;
    explosiveId: string | null;
    weight: number;
    variant: number;
    description?: string | null;
}

export interface ISizeDB {
    /**
     * length or radius
     */
    length: number | null; // m;
    width: number | null; // m;
    height: number | null; // m;
    variant: number | null;
    name?: string | null;
}

export interface IWeightDB {
    weight: number; // kg;
    variant: number | null;
}
