import { type INeutralization, type IMarking, type IStructure, type IAction } from './common';

interface ILiquidator {
    type: string;
    times: number[];
}

interface IReduction {
    type: string;
    times: number[];
}

export interface IFuse {
    marking: IMarking;
    structure: IStructure;
    action: IAction;
    liquidator: ILiquidator | false | null;
    reduction: IReduction | false | null;
    neutralization: INeutralization | false | null;
}
