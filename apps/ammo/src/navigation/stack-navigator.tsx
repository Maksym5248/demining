import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type StackAnimationTypes } from 'react-native-screens';

import { SCREENS } from '~/constants';
import * as screens from '~/screens';
import { useTheme } from '~/styles';

const Stack = createNativeStackNavigator();

export const StackNavigator = () => {
    const theme = useTheme();

    const params = {
        screenOptions: {
            headerShown: false,
            headerTintColor: theme.colors.primary,
            animation: 'slide_from_right' as StackAnimationTypes,
            animationTypeForReplace: 'push' as const,
        },
        initialRouteName: SCREENS.SIGN_IN,
    };

    return (
        <Stack.Navigator {...params}>
            {/* AUTH */}
            <Stack.Screen name={SCREENS.SIGN_IN} component={screens.SignInScreen} />
            <Stack.Screen name={SCREENS.SIGN_UP} component={screens.SignUpScreen} />

            {/* HOME */}
            <Stack.Screen name={SCREENS.HOME} component={screens.HomeScreen} />
        </Stack.Navigator>
    );
};
