import { type IExplosiveActionValueParams } from 'shared-my-client/stores';

export interface ListItemProps {
    item: IExplosiveActionValueParams;
    index: number;
    onRemove: (index: number) => void;
}

export interface IExplosiveObjectActionListProps {
    onUpdate: (data: IExplosiveActionValueParams[]) => void;
    data: IExplosiveActionValueParams[];
}
