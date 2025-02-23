import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { ListItem as ListItemCore, Header, type IFlatListRenderedItem, List } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { type IDataItem } from './data-item.model';
import { settingsVM, type ISettingsVM } from './settings.vm';

const ListItem = observer(({ item }: { item: IDataItem }) => {
    const t = useTranslate('screens.settings');

    const onPress = () => item.press();

    return <ListItemCore title={t(item.title)} onPress={onPress} />;
});

export const SettingsScreen = observer(() => {
    const theme = useTheme();
    const styles = useStylesCommon();
    const t = useTranslate('screens.settings');

    const vm = useViewModel<ISettingsVM>(settingsVM);

    const renderItem = useCallback(({ item }: IFlatListRenderedItem<IDataItem>) => <ListItem item={item} />, []);

    return (
        <View style={styles.container}>
            <Header title={t('title')} backButton="back" color={theme.colors.white} />
            <List data={vm.asArray} renderItem={renderItem} />
        </View>
    );
});
