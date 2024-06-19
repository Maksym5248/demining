import { type IExplosiveObjectActionValueParams } from '@/shared-client/stores';

export interface ListItemProps {
    item: IExplosiveObjectActionValueParams;
    index: number;
    onRemove: (index: number) => void;
}

export interface IExplosiveObjectActionListProps {
    onUpdate: (data: IExplosiveObjectActionValueParams[]) => void;
    data: IExplosiveObjectActionValueParams[];
}
