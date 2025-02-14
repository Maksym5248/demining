import React from 'react';

import { View } from 'react-native';

import { useTheme } from '~/styles';

import { useStyles } from './list-empty.style';
import { type IListEmptyProps } from './list-empty.type';
import { Svg } from '../svg';
import { Text } from '../text';

export const ListEmpty = ({ title, name, style }: IListEmptyProps) => {
    const s = useStyles();
    const theme = useTheme();

    return (
        <View style={[s.container, style]}>
            <Text style={s.text} color={theme.colors.accent}>
                {title}
            </Text>
            <Svg name={name} style={s.svg} color={theme.colors.accent} />
        </View>
    );
};
