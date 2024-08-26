import React, { forwardRef, memo } from 'react';

import { type NavigationContainerRef } from '@react-navigation/core';
import { NavigationContainer } from '@react-navigation/native';

import { StackNavigator } from './stack-navigator';

const RootNavigationComponent = forwardRef((props, ref: React.Ref<NavigationContainerRef<any>>) => {
    return (
        <NavigationContainer ref={ref} {...props}>
            <StackNavigator />
        </NavigationContainer>
    );
});

RootNavigationComponent.displayName = 'RootNavigation';

export const RootNavigation = memo(RootNavigationComponent);
