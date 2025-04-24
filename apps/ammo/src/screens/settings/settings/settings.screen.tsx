import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { ListItem as ListItemCore, Header, type IFlatListRenderedItem, List, Avatar, Button, Text } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { type IDataItem } from './data-item.model';
import { useStyles } from './settings.style';
import { settingsVM, type ISettingsVM } from './settings.vm';

const ListItem = observer(({ item }: { item: IDataItem }) => {
    const t = useTranslate('screens.settings');

    const onPress = () => item.press();

    return <ListItemCore title={t(item.title)} onPress={onPress} state={item.isActive ? 'active' : 'default'} />;
});

export const SettingsScreen = observer(() => {
    const theme = useTheme();
    const styles = useStylesCommon();
    const s = useStyles();
    const t = useTranslate('screens.settings');

    const vm = useViewModel<ISettingsVM>(settingsVM);

    const renderItem = useCallback(({ item }: IFlatListRenderedItem<IDataItem>) => <ListItem item={item} />, []);

    const onOpenSignIn = () => vm.openSignIn();

    return (
        <View style={styles.container}>
            <Header title={t('title')} backButton="none" color={theme.colors.white} />
            <List
                data={vm.asArray}
                renderItem={renderItem}
                ListHeaderComponent={() => (
                    <View>
                        <Avatar size={108} style={s.avatar} />
                        {!vm.isAuthenticated && <Button.Base title={t('autenticate')} style={s.autenticate} onPress={onOpenSignIn} />}
                        {!!vm.isAuthenticated && <Text text={vm.userName} />}
                    </View>
                )}
            />
        </View>
    );
});
