import { IExplosiveObjectActionValueParams } from '~/stores'

export type IExplosiveObjectActionListItem = Omit<IExplosiveObjectActionValueParams, "documentType" | "documentId">;

export interface ListItemProps {
    item: IExplosiveObjectActionListItem;
    index: number;
    onRemove: (index: number) => void;
}

export interface IExplosiveObjectActionListProps {
    onUpdate: (data: IExplosiveObjectActionListItem[]) => void;
    data: IExplosiveObjectActionListItem[];
}