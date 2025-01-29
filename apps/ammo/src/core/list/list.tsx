import React, { forwardRef } from 'react';

import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { useTranslate } from '~/localization';
import { useDevice } from '~/styles';

import { useStyles } from './list.styles';
import { type IFlatListProps } from './list.types';
import { Loading } from '../loading';
import { Text } from '../text';

function keyExtractor<T>(item: T, index: number): string {
    // @ts-expect-error
    return item?.id ? String(item?.id) : String(index);
}

function Component<T>(
    { isLoading, isLoadingMore, isSearch, isEndReached, onEndReached, data, ...props }: IFlatListProps<T>,
    ref: React.Ref<FlatList>,
) {
    const s = useStyles();
    const device = useDevice();
    const t = useTranslate('components.list');

    const _onEndReached = (info: { distanceFromEnd: number }) => {
        if (!isEndReached) onEndReached?.(info);
    };

    if (isLoading) {
        return <Loading isVisible size="large" />;
    }

    const text = isSearch ? t('emptySearch') : t('empty');
    const isDataEmpty = !!data?.length;

    return (
        <FlatList
            ref={ref}
            keyExtractor={keyExtractor}
            data={data}
            contentInset={{ bottom: 20 + device.inset.bottom }}
            {...props}
            ItemSeparatorComponent={() => <View style={s.separator} />}
            ListEmptyComponent={() => (
                <View style={s.emptyContainer}>
                    <Text type="p4" text={text} />
                </View>
            )}
            ListFooterComponent={
                isLoadingMore && isDataEmpty && !isLoading ? () => <Loading isVisible size="small" style={s.loadingMore} /> : undefined
            }
            onEndReached={_onEndReached}
        />
    );
}

export const List = forwardRef(Component) as <T>(
    props: IFlatListProps<T> & React.RefAttributes<FlatList<T>>,
) => ReturnType<typeof Component>;
