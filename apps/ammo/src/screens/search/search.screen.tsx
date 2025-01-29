import React from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { SCREENS } from '~/constants';
import { Card, Header, Icon, type IFlatListRenderedItem, List, TextInput } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { Navigation } from '~/services';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './search.style';
import { searchVM, type ISearchVM, type DataItem } from './search.vm';

const ListItem = observer(({ item }: Pick<IFlatListRenderedItem<DataItem>, 'item'>) => {
    const tDictionaries = useTranslate('dictionaries');

    const tags = [tDictionaries(item.type)];

    if (item.typeName) {
        tags.push(item.typeName);
    }

    const onOpenExplosive = (id: string) => {
        Navigation.navigate(SCREENS.EXPLOSIVE_DETAILS, { id });
    };

    return (
        <Card
            type="image"
            title={item.data.displayName}
            uri={item.data.imageUri}
            tags={tags}
            subTitle={item.classItemsNames.join(', ')}
            onPress={() => onOpenExplosive(item.id)}
        />
    );
});

export const SearchScreen = observer(() => {
    const theme = useTheme();
    const s = useStyles();
    const styles = useStylesCommon();
    const t = useTranslate('screens.search');

    const vm = useViewModel<ISearchVM>(searchVM);

    const renderItem = ({ item }: IFlatListRenderedItem<DataItem>) => <ListItem item={item} />;

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
            <List<DataItem>
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
