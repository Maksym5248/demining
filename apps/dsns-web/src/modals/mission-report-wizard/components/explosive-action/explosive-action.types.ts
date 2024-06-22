import { type IExplosiveActionDataParams } from 'shared-my-client/stores';

export interface ListItemProps {
    item: IExplosiveActionDataParams;
    index: number;
    onRemove: (index: number) => void;
}

export interface IExplosiveObjectActionListProps {
    onUpdate: (data: IExplosiveActionDataParams[]) => void;
    data: IExplosiveActionDataParams[];
}
