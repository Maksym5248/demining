import { memo } from 'react';

import { type IMapFiguresProps } from './map.types';
import { type IMapItem } from '../map-item';

function Component<T extends IMapItem>({ items, isVisibleInArea = false, renderMapItem }: IMapFiguresProps<T>) {
    return isVisibleInArea && items?.map(el => renderMapItem?.(el));
}

export const MapItems = memo(Component) as <T extends IMapItem>(props: IMapFiguresProps<T>) => JSX.Element;
