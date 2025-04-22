import { type ISectionInfoDB, type IFieldDB, type MATERIAL, type IRangeDB, type ISizeDB, type IBaseDB, type APPROVE_STATUS } from '~/db';

import { type IWeightDB, type IFillerDB } from './common';

export interface IExplosiveObjectDetailsDB extends IBaseDB {
    status: APPROVE_STATUS;
    fullDescription: string | null;
    imageUris: string[] | null;
    // characteristics
    materialV2: MATERIAL[];
    sizeV2: ISizeDB[] | null; //м;
    weightV2: IWeightDB[] | null;
    temperature: IRangeDB | null;
    filler: IFillerDB[] | null; // спорядження ВР;
    caliber: number | null; // ammo
    fuseIds: string[]; // ammo
    fervorIds: string[] | null; // підривник
    liquidatorShort: string | null; // час самоліквідації
    foldingShort: string | null; // час зведення
    extractionShort: string | null; // механізм невилучення
    damageV2: null | {
        radius: IRangeDB | null; // радіус суцільного ураження, м
        distance: IRangeDB | null; // дальність дольоту осколків, м
        number: IRangeDB | null; // кількість уражаючих елементів, од
        squad: IRangeDB | null; // площа ураження, м
        height: IRangeDB | null; // висота ураження, м
        action: string | null; // Вражаюча дія міни
        additional: IFieldDB[] | null; // додатково
    };
    // fuse
    targetSensor: string | null; // Підривник
    sensitivityV2: {
        effort: IRangeDB | null; // зусилля, кг
        sensitivity: string | null; // чутливість
        additional: IFieldDB[] | null; // додатково
    } | null; // чутливість
    timeWork: string | null; // час роботи
    additional: IFieldDB[] | null; // додатково

    // description
    purpose: ISectionInfoDB | null; // призначення/ураження;
    structure: ISectionInfoDB | null; // будова;
    action: ISectionInfoDB | null; // принцип дії;
    installation: ISectionInfoDB | null; // спосіб встановлення
    liquidator?: ISectionInfoDB | null; // самоліквідатор
    extraction?: ISectionInfoDB | null; // механізм невилучення
    folding?: ISectionInfoDB | null; // механізм зведення
    neutralization: ISectionInfoDB | null; // нейтралізація
    marking: ISectionInfoDB | null; // маркування
    historical: ISectionInfoDB | null; // історичні дані

    /** @deprecated  */
    weight?: number | null; // kg
    /** @deprecated */
    size?: ISizeDB | null; //м
    /** @deprecated */
    sensitivity?: string | null; // чутливість
    /** @deprecated */
    material?: MATERIAL;
}
