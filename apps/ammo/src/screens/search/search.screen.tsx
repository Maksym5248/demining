import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Card, Header, Icon, List, TextInput } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { type ISearchItem } from './search-item.model';
import { useStyles } from './search.style';
import { searchVM, type ISearchVM } from './search.vm';

const ListItem = observer(({ item }: { item: ISearchItem }) => {
    const tDictionaries = useTranslate('dictionaries');

    const tags = [tDictionaries(item.type)];

    if (item.typeName) {
        tags.push(item.typeName);
    }

    const onOpenExplosive = () => item.openItem();

    return (
        <Card
            type="image"
            title={item.data.displayName}
            uri={item.data.imageUri}
            tags={tags}
            subTitle={item.classItemsNames.join(', ')}
            onPress={onOpenExplosive}
        />
    );
});

export const SearchScreen = observer(() => {
    const theme = useTheme();
    const s = useStyles();
    const styles = useStylesCommon();
    const t = useTranslate('screens.search');

    const vm = useViewModel<ISearchVM>(searchVM);

    const renderItem = useCallback(({ item }: { item: ISearchItem }) => <ListItem item={item} />, []);

    const onPressFilter = () => vm.openFilters();

    return (
        <View style={styles.container}>
            <Header
                title={t('title')}
                backButton="back"
                color={theme.colors.white}
                style={s.header}
                right={<Icon name="filter" color={theme.colors.white} size={24} onPress={onPressFilter} />}
            />
            <View style={s.filler} />
            <TextInput
                placeholder={t('search')}
                onChangeValue={value => vm.setSearchBy(value)}
                value={vm.searchBy}
                right={<Icon name="search" color={theme.colors.textSecondary} />}
                isClearable
                style={s.searchContainer}
            />
            <List
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
