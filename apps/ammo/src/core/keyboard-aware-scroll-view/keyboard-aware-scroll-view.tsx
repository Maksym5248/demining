import React from 'react';

import { View } from 'react-native';
import { KeyboardAwareScrollView as KeyboardAwareScrollViewRN } from 'react-native-keyboard-aware-scroll-view';

import { useDevice } from '~/styles';

import { type KeyboardAwareScrollViewProps } from './keyboard-aware-scroll-view.types';

export const KeyboardAwareScrollView = ({ contentStyle, children, ...rest }: KeyboardAwareScrollViewProps) => {
    const device = useDevice();

    return (
        <KeyboardAwareScrollViewRN
            // extraHeight={120}
            bounces={false}
            keyboardShouldPersistTaps="handled"
            enableAutomaticScroll={device.isIOS}
            enableOnAndroid
            {...rest}>
            <View style={contentStyle}>{children}</View>
        </KeyboardAwareScrollViewRN>
    );
};
