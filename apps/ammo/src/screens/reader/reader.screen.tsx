import React, { useEffect, useRef, useState } from 'react';

import { observer } from 'mobx-react';
import { Animated, Keyboard, View, type TextInput as TextInputRN } from 'react-native';
import Pdf from 'react-native-pdf';

import { STORAGE } from '~/constants';
import { Header, Icon, Loading, Text, Touchable, TextInput } from '~/core';
import { LocalStore } from '~/services';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './reader.style';
import { type IReaderScreenProps } from './reader.types';

const getKey = (title?: string) => `${STORAGE.BOOK_LAST_PAGE}.${title}`;

export const ReaderScreen = observer(({ route }: IReaderScreenProps) => {
    const { uri, title } = route?.params || {};
    const theme = useTheme();
    const s = useStyles();
    const styles = useStylesCommon();
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState({
        page: LocalStore.getNumber(getKey(title)) ?? 0,
        numberOfPages: 0,
    });
    const [page, setPage] = useState(LocalStore.getNumber(getKey(title)));
    const [text, setText] = useState('');
    const ref = useRef<TextInputRN>(null);

    const timer = useRef<NodeJS.Timeout | null>(null);
    const [y] = useState(new Animated.Value(-200));

    const source = { uri };

    useEffect(() => {
        LocalStore.set(getKey(title), currentPage.page);
    }, [currentPage.page]);

    const onPageChanged = (page: number, numberOfPages: number) => {
        setIsLoading(false);

        timer.current && clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            setCurrentPage({ page, numberOfPages });
        }, 400);
    };

    const onOpenSearch = () => {
        Animated.timing(y, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

        ref?.current?.focus();
    };

    const onChangeValue = (text: string) => {
        setText(text);
    };

    const onCloseSearch = () => {
        Animated.timing(y, {
            toValue: -200,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setText('');
        Keyboard.dismiss();
    };

    const onSubmitEditing = () => {
        setPage(Number(text));
        LocalStore.set(getKey(title), Number(text));
        onCloseSearch();
    };

    return (
        <View style={styles.container}>
            <Header title={title} backButton="back" color={theme.colors.white} />
            <Pdf page={page} source={source} style={s.pdf} onPageChanged={onPageChanged} />
            <Loading isVisible={isLoading} style={styles.fillAbsolute} />
            {!isLoading && (
                <Touchable style={s.pagesContainer} onPress={onOpenSearch}>
                    <Text color={theme.colors.white} text={`${currentPage.page} / ${currentPage.numberOfPages}`} />
                </Touchable>
            )}
            <Animated.View style={[s.searchContainer, { transform: [{ translateY: y }] }]}>
                <TextInput
                    ref={ref}
                    placeholder="Ввести сторінку"
                    keyboardType="numeric"
                    returnKeyType="done"
                    onChangeValue={onChangeValue}
                    onSubmitEditing={onSubmitEditing}
                    value={text}
                    style={s.input}
                />
                <Icon name="close" size={24} color={theme.colors.white} onPress={onCloseSearch} />
            </Animated.View>
        </View>
    );
});
