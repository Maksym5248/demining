import { IExplosiveObjectHistoryValueParams } from '~/stores'


export type IExplosiveObjectHistoryListItem = Omit<IExplosiveObjectHistoryValueParams, "missionReportId">;

export interface ListItemProps {
    item: IExplosiveObjectHistoryListItem;
    index: number;
    onRemove: (index: number) => void;
}

export interface IExplosiveObjectHistoryListProps {
    onUpdate: (data: IExplosiveObjectHistoryListItem[]) => void;
    data: IExplosiveObjectHistoryListItem[];
}