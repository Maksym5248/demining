import React, { forwardRef } from 'react';

import { type ListRenderItem } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { type IFlatListProps } from './list.types';

function keyExtractor<T extends { id: string }>(item: T, index: number): string {
    return item?.id ? String(item?.id) : String(index);
}

function Component<T extends { id: string }>(props: IFlatListProps<T>, ref: React.Ref<FlatList>) {
    return <FlatList ref={ref} keyExtractor={keyExtractor} {...props} renderItem={props.renderItem as ListRenderItem<T>} />;
}

export const List = forwardRef(Component) as <T extends { id: string }>(
    props: IFlatListProps<T> & React.RefAttributes<FlatList<T>>,
) => ReturnType<typeof Component>;
