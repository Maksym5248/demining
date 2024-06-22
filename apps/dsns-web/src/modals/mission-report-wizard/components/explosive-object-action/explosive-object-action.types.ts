import { type IExplosiveObjectActionDataParams } from 'shared-my-client/stores';

export interface ListItemProps {
    item: IExplosiveObjectActionDataParams;
    index: number;
    onRemove: (index: number) => void;
}

export interface IExplosiveObjectActionListProps {
    onUpdate: (data: IExplosiveObjectActionDataParams[]) => void;
    data: IExplosiveObjectActionDataParams[];
}
