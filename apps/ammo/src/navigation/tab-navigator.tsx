import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { SCREENS } from '~/constants';
import { Icon } from '~/core';
import * as screens from '~/screens';
import { useTheme } from '~/styles';

const Tab = createBottomTabNavigator();

const getTabBar = ({ color, size }: { focused: boolean; color: string; size: number }) => {
    return <Icon name="dictionary" size={size} color={color} />;
};

const commonTabbarOptiosn = {
    tabBarShowLabel: false,
};

export const TabNavigator = () => {
    const theme = useTheme();

    const screenOptions = {
        tabBarIcon: getTabBar,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.secondary,
        headerShown: false,
    };

    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name={SCREENS.HOME} component={screens.HomeScreen} options={commonTabbarOptiosn} />
        </Tab.Navigator>
    );
};
