import React, { memo, useEffect, useState } from 'react';

import { View } from 'react-native';

import { Icon } from '~/core';
import { Debugger } from '~/services';
import { useTheme } from '~/styles';

import { useStyles } from './debugger-view.styles';
import { LogsDebugger } from './routes';

export const DebuggerView = memo(() => {
    const s = useStyles();
    const theme = useTheme();

    const [isVisible, setVisible] = useState(Debugger.isVisible);

    const onHide = () => Debugger.hide();

    useEffect(() => {
        const unsubscribeVisible = Debugger.onChangeVisible(setVisible);

        return () => {
            unsubscribeVisible();
        };
    }, []);

    return (
        !!isVisible && (
            <View style={s.container}>
                <View style={s.content}>
                    <View style={s.header}>
                        <Icon onPress={onHide} name="close" style={s.closeButton} color={theme.colors.white} />
                    </View>
                    <LogsDebugger />
                </View>
            </View>
        )
    );
});

DebuggerView.displayName = 'DebuggerView';
