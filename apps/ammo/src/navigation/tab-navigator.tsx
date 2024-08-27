import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { SCREENS } from '~/constants';
import * as screens from '~/screens';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen name={SCREENS.HOME} component={screens.HomeScreen} />
    </Tab.Navigator>
);
