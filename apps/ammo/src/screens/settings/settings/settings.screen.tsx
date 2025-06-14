import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Auth } from '~/containers';
import { ListItem as ListItemCore, Header, type IFlatListRenderedItem, List, Avatar, Text, Icon } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';
import { Device } from '~/utils';

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

    const onSignOut = () => vm.signOut.run();
    // Do not delete it because it doesnt handled correctly in the mobx
    const photo = vm.photoUri;
    const userName = vm.userName;

    return (
        <View style={styles.container}>
            <Header
                title={t('title')}
                backButton="none"
                color={theme.colors.white}
                right={vm.isRegistered ? <Icon name="logout" color={theme.colors.white} onPress={onSignOut} /> : undefined}
            />
            <List
                data={vm.asArray}
                renderItem={renderItem}
                ListHeaderComponent={() => (
                    <View style={s.userInfo}>
                        <Avatar size={108} style={s.avatar} uri={photo} />
                        <Auth>
                            <Text text={userName} />
                        </Auth>
                    </View>
                )}
            />
            <View style={s.footer}>
                <Text text={Device.appInfo} color={theme.colors.inertDark} />
            </View>
        </View>
    );
});
