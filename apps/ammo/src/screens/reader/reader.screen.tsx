import React, { useRef, useState } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import Pdf from 'react-native-pdf';

import { Header, Loading, Text } from '~/core';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './reader.style';
import { type IReaderScreenProps } from './reader.types';

export const ReaderScreen = observer(({ route }: IReaderScreenProps) => {
    const { uri, title } = route?.params || {};
    const theme = useTheme();
    const s = useStyles();
    const styles = useStylesCommon();
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState({
        page: 0,
        numberOfPages: 0,
    });
    const timer = useRef<NodeJS.Timeout | null>(null);

    const source = { uri };

    const onPageChanged = (page: number, numberOfPages: number) => {
        setIsLoading(false);

        timer.current && clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            setCurrentPage({ page, numberOfPages });
        }, 400);
    };

    return (
        <View style={styles.container}>
            <Header title={title} backButton="back" color={theme.colors.white} />
            <Pdf source={source} style={s.pdf} onPageChanged={onPageChanged} />
            <Loading isVisible={isLoading} style={styles.fillAbsolute} />
            {!isLoading && (
                <View style={s.pagesContainer}>
                    <Text color={theme.colors.white} text={`${currentPage.page} / ${currentPage.numberOfPages}`} />
                </View>
            )}
        </View>
    );
});
