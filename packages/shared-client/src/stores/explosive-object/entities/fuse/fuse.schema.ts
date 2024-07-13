import {
    type IFuseDTO,
    type IMarkingDTO,
    type IStructureDTO,
    type IActionDTO,
    type ILiquidatorDTO,
    type IReductionDTO,
    type INeutralizationDTO,
} from '~/api';

export interface IFuseData {
    marking: IMarkingDTO;
    structure: IStructureDTO;
    action: IActionDTO;
    liquidator: ILiquidatorDTO | false | null;
    reduction: IReductionDTO | false | null;
    neutralization: INeutralizationDTO | false | null;
}

export const createFuse = (value: IFuseDTO): IFuseData => {
    return {
        marking: value.marking,
        structure: value.structure,
        action: value.action,
        liquidator: value.liquidator,
        reduction: value.reduction,
        neutralization: value.neutralization,
    };
};
