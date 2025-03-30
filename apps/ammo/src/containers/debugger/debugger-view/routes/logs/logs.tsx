import React, { type FC, useState, useEffect, memo } from 'react';

import { Text, ScrollView, View } from 'react-native';
import { dates, type ILog, LogLevel } from 'shared-my-client';

import { Logger } from '~/services';

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

    return (
        <ScrollView style={s.container}>
            <ScrollView style={s.containerInside} horizontal={true} showsHorizontalScrollIndicator={false}>
                <View>
                    {logs.map((log, i) => (
                        <View style={s.row} key={i}>
                            <Text style={log?.level === LogLevel.Error ? s.logError : s.log} selectable={true}>
                                {`${dates.format(log?.createAt, 'HH:mm:ss')} - `}
                            </Text>
                            <Text style={log?.level === LogLevel.Error ? s.logError : s.log}>{`${log?.value}`}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </ScrollView>
    );
});

LogsDebugger.displayName = 'LogsDebugger';
