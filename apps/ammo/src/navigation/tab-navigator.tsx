import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { SCREENS } from '~/constants';
import { Icon, type IIconName } from '~/core';
import { useTranslate } from '~/localization';
import * as screens from '~/screens';
import { useTheme } from '~/styles';

const Tab = createBottomTabNavigator();

const getIcon =
    (name: IIconName) =>
    // eslint-disable-next-line react/display-name
    ({ color, size }: { focused: boolean; color: string; size: number }) => <Icon name={name} size={size} color={color} />;

const commonTabbarOptions = {
    tabBarShowLabel: true,
};

const dictionaryTabbarOptions = (t: (key: string) => string | undefined) => ({
    ...commonTabbarOptions,
    tabBarIcon: getIcon('dictionary'),
    tabBarLabel: t('screens.home.title'),
});

const settingTabbarOptions = (t: (key: string) => string | undefined) => ({
    ...commonTabbarOptions,
    tabBarIcon: getIcon('settings'),
    tabBarLabel: t('screens.settings.title'),
});

export const TabNavigator = () => {
    const theme = useTheme();
    const t = useTranslate();

    const params = {
        screenOptions: {
            tabBarActiveTintColor: theme.colors.accent,
            tabBarInactiveTintColor: theme.colors.secondary,
            headerShown: false,
        },
        initialRouteName: SCREENS.HOME,
    };

    return (
        <Tab.Navigator {...params}>
            <Tab.Screen name={SCREENS.HOME} component={screens.HomeScreen} options={dictionaryTabbarOptions(t)} />
            <Tab.Screen name={SCREENS.SETTINGS} component={screens.SettingsScreen} options={settingTabbarOptions(t)} />
        </Tab.Navigator>
    );
};
