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
        initialRouteName: SCREENS.HOME,
    };

    return (
        <Stack.Navigator {...params}>
            {/* AUTH */}
            <Stack.Screen name={SCREENS.SIGN_IN} component={screens.SignInScreen} />
            <Stack.Screen name={SCREENS.SIGN_UP} component={screens.SignUpScreen} />

            {/* HOME */}
            <Stack.Screen name={SCREENS.HOME} component={screens.HomeScreen} />
            <Stack.Screen name={SCREENS.DICTIONARIES} component={screens.DictionariesScreen} />
            <Stack.Screen
                name={SCREENS.DICTIONARIES_ANIMATED}
                component={screens.DictionariesScreen}
                options={{
                    animation: 'fade' as StackAnimationTypes,
                }}
            />
            <Stack.Screen name={SCREENS.EXPLOSIVE_DETAILS} component={screens.ExplosiveDetailsScreen} />
            <Stack.Screen name={SCREENS.EXPLOSIVE_OBJECT_DETAILS} component={screens.ExplosiveObjectDetailsScreen} />
            <Stack.Screen name={SCREENS.EXPLOSIVE_DEVICE_DETAILS} component={screens.ExplosiveDeviceDetailsScreen} />
            <Stack.Screen name={SCREENS.EXPLOSIVE_OBJECT_CLASSIFICATION} component={screens.ExplosiveObjectClassificationScreen} />
            <Stack.Screen name={SCREENS.EXPLOSIVE_OBJECT_TYPE} component={screens.ExplosiveObjectTypeScreen} />
            <Stack.Screen name={SCREENS.SETTINGS} component={screens.SettingsScreen} />
            <Stack.Screen name={SCREENS.ABOUT} component={screens.AboutScreen} />
            <Stack.Screen name={SCREENS.BOOKS} component={screens.BooksScreen} />
        </Stack.Navigator>
    );
};
