import React, { type FC, useState, useEffect, memo } from 'react';

import Clipboard from '@react-native-clipboard/clipboard';
import { Text, ScrollView, View } from 'react-native';
import { dates, type ILog, LogLevel } from 'shared-my-client';

import { Touchable } from '~/core';
import { Logger, Message } from '~/services';

import { useStyles } from './logs.styles';

export const LogsDebugger: FC = memo(() => {
    const s = useStyles();

    const [logs, setLogs] = useState<ILog[]>(Logger.getLogs());

    useEffect(() => {
        const removeListener = Logger.onChange(value => setLogs(prev => [...prev, value]));

        return () => {
            removeListener();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onPressItem = (log: ILog) => {
        Clipboard.setString(log?.value ?? '');
        Message.success('copied to clipboard');
    };

    return (
        <ScrollView style={s.container}>
            <ScrollView style={s.containerInside} horizontal={true} showsHorizontalScrollIndicator={false}>
                <View>
                    {logs.map((log, i) => (
                        <Touchable onPress={() => !!log?.value && onPressItem(log)} style={s.row} key={i}>
                            <Text style={log?.level === LogLevel.Error ? s.logError : s.log} selectable={true}>
                                {`${dates.format(log?.createAt, 'HH:mm:ss')} - `}
                            </Text>
                            <Text style={log?.level === LogLevel.Error ? s.logError : s.log} selectable={true}>{`${log?.value}`}</Text>
                        </Touchable>
                    ))}
                </View>
            </ScrollView>
        </ScrollView>
    );
});

LogsDebugger.displayName = 'LogsDebugger';
