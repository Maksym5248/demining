import {
    type INeutralizationDB,
    type IMarkingDB,
    type IStructureDB,
    type IActionDB,
    type ILiquidatorDB,
    type IReductionDB,
} from './common';

export interface IFuseDB {
    marking: IMarkingDB;
    structure: IStructureDB;
    action: IActionDB;
    liquidator: ILiquidatorDB | false | null;
    reduction: IReductionDB | false | null;
    neutralization: INeutralizationDB | false | null;
}
