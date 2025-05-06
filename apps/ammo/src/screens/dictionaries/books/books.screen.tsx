import React, { useCallback, useEffect, useRef } from 'react';

import { observer } from 'mobx-react';
import { Keyboard, View, type TextInput as TextInputRN } from 'react-native';
import { measurement } from 'shared-my';

import { Badge, Card, Header, Icon, type IFlatListRenderedItem, List, Progress, TextInput } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { STATUS, type IDataItem } from './books-item.model';
import { useStyles } from './books.style';
import { type IBookScreenProps } from './books.types';
import { searchVM, type ISearchVM } from './books.vm';

const ListItem = observer(({ item, index }: { item: IDataItem; index: number }) => {
    const s = useStyles();
    const theme = useTheme();
    const isLeft = index % 2 === 0;

    const onPress = () => item.openItem();
    const onPressLoad = () => item.load.run();

    useEffect(() => {
        item.checkLoaded.run();
    }, []);

    return (
        <View style={s.cardContainer}>
            <Card
                type="imageBox"
                tags={item.typeNames}
                title={item.displayName}
                uri={item.imageUri}
                onPress={item.isLoaded ? onPress : undefined}
                subTitle={measurement.formatBytes(item.data.size)}
                style={[s.card, isLeft ? s.cardLeft : s.cardRight]}
            />
            {item.status === STATUS.IDDLE && <Icon name="download" style={s.icon} color={theme.colors.accent} onPress={onPressLoad} />}
            {item.status === STATUS.LOADING && <Progress.Circle style={s.icon} size={24} progress={item.progress} />}
            {item.isLoaded && <Icon name="success" size={24} style={s.icon} color={theme.colors.success} />}
        </View>
    );
});

export const BooksScreen = observer(({ route }: IBookScreenProps) => {
    const { filters, autoFocus } = route?.params || {};
    const theme = useTheme();
    const s = useStyles();
    const styles = useStylesCommon();
    const t = useTranslate('screens.books');
    const inputRef = useRef<TextInputRN>(null);

    const vm = useViewModel<ISearchVM>(searchVM, filters);

    const renderItem = useCallback((params: IFlatListRenderedItem<IDataItem>) => <ListItem {...params} />, []);

    const onPressFilter = () => vm.openFilters();

    useEffect(() => {
        if (autoFocus) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [autoFocus, inputRef]);

    return (
        <View style={styles.container}>
            <Header
                title={t('title')}
                backButton="back"
                color={theme.colors.white}
                style={s.header}
                right={
                    <Badge count={vm.filtersCount}>
                        <Icon name="filter" color={theme.colors.white} size={24} onPress={onPressFilter} />
                    </Badge>
                }
            />
            <View style={s.filler} />
            <TextInput
                ref={inputRef}
                placeholder={t('search')}
                onChangeValue={value => vm.setSearchBy(value)}
                value={vm.searchBy}
                right={<Icon name="search" color={theme.colors.textSecondary} />}
                isClearable
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                style={s.searchContainer}
            />

            <List
                data={vm.asArray}
                renderItem={renderItem}
                isLoading={vm.isLoading}
                isLoadingMore={vm.isLoadingMore}
                isEndReached={vm.isEndReached}
                onEndReached={() => vm.loadMore()}
                numColumns={2}
            />
        </View>
    );
});
