import React from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import Pdf from 'react-native-pdf';

import { Header } from '~/core';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './reader.style';
import { type IReaderScreenProps } from './reader.types';

export const ReaderScreen = observer(({ route }: IReaderScreenProps) => {
    const { uri, title } = route?.params || {};
    const theme = useTheme();
    const s = useStyles();
    const styles = useStylesCommon();

    const source = { uri };

    return (
        <View style={styles.container}>
            <Header title={title} backButton="back" color={theme.colors.white} />
            <Pdf source={source} style={s.pdf} />
        </View>
    );
});
