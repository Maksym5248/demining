import React from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Card, Header, Icon, type IFlatListRenderedItem, List, TextInput } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './search.style';
import { type Item, searchVM, type ISearchVM } from './search.vm';

export const SearchScreen = observer(() => {
    const theme = useTheme();
    const s = useStyles();
    const styles = useStylesCommon();
    const t = useTranslate('screens.search');

    const vm = useViewModel<ISearchVM>(searchVM);

    const renderItem = ({ item }: IFlatListRenderedItem<Item>) => <Card type="image" title={item.displayName} uri={item.imageUri} />;

    return (
        <View style={styles.container}>
            <Header title={t('title')} backButton="back" color={theme.colors.white} style={s.header} />
            <View style={s.filler} />
            <TextInput
                placeholder={t('search')}
                onChangeValue={value => vm.setSearchBy(value)}
                value={vm.searchBy}
                right={<Icon name="search" color={theme.colors.textSecondary} />}
                isClearable
                style={s.searchContainer}
            />
            <List<Item>
                data={vm.asArray}
                renderItem={renderItem}
                style={s.flatList}
                isLoading={vm.isLoading}
                isLoadingMore={vm.isLoadingMore}
                isEndReached={vm.isEndReached}
                onEndReached={() => vm.loadMore()}
            />
        </View>
    );
});
