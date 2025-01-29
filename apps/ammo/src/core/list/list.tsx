import React, { forwardRef } from 'react';

import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { useStyles } from './list.styles';
import { type IFlatListProps } from './list.types';
import { Loading } from '../loading';

function keyExtractor<T>(item: T, index: number): string {
    // @ts-expect-error
    return item?.id ? String(item?.id) : String(index);
}

function Component<T>({ isLoading, ...props }: IFlatListProps<T>, ref: React.Ref<FlatList>) {
    const s = useStyles();

    if (isLoading) {
        return <Loading isVisible />;
    }

    return <FlatList ref={ref} keyExtractor={keyExtractor} {...props} ItemSeparatorComponent={() => <View style={s.separator} />} />;
}

export const List = forwardRef(Component) as <T>(
    props: IFlatListProps<T> & React.RefAttributes<FlatList<T>>,
) => ReturnType<typeof Component>;
