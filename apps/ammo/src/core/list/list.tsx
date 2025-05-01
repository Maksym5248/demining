import React, { forwardRef } from 'react';

import { isNumber } from 'lodash';
import { type NativeScrollEvent, type NativeSyntheticEvent, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { useTooltipRoot } from '~/hooks';
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
    {
        isLoading,
        isLoadingMore,
        isSearch,
        isEndReached,
        onEndReached,
        data,
        onScrollBeginDrag,
        contentContainerStyle,
        separator,
        ...props
    }: IFlatListProps<T>,
    ref: React.Ref<FlatList>,
) {
    const s = useStyles();
    const device = useDevice();
    const t = useTranslate('core.list');
    const tooltip = useTooltipRoot();

    const _onEndReached = (info: { distanceFromEnd: number }) => {
        if (!isEndReached) onEndReached?.(info);
    };

    if (isLoading) {
        return <Loading isVisible size="large" />;
    }

    const text = isSearch ? t('emptySearch') : t('empty');
    const isDataEmpty = !!data?.length;

    const _onScrollBeginDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        tooltip.onScrollBegin();
        onScrollBeginDrag?.(event);
    };

    return (
        <FlatList
            ref={ref}
            keyExtractor={keyExtractor}
            data={data}
            contentInset={{ bottom: 20 + device.inset.bottom }}
            ItemSeparatorComponent={() => <View style={[s.separator, isNumber(separator) ? { height: separator } : {}]} />}
            ListEmptyComponent={() => (
                <View style={s.emptyContainer}>
                    <Text type="p4" text={text} />
                </View>
            )}
            ListFooterComponent={
                isLoadingMore && isDataEmpty && !isLoading ? () => <Loading isVisible size="small" style={s.loadingMore} /> : undefined
            }
            {...props}
            onEndReached={_onEndReached}
            style={[s.container, props.style]}
            contentContainerStyle={[s.contentContainer, contentContainerStyle]}
            onScrollBeginDrag={_onScrollBeginDrag}
        />
    );
}

export const List = forwardRef(Component) as <T>(
    props: IFlatListProps<T> & React.RefAttributes<FlatList<T>>,
) => ReturnType<typeof Component>;
