import React from 'react';

import { observer } from 'mobx-react';
import { View, Animated } from 'react-native';

import { images } from '~/assets';
import { Card, Header, Icon, Scroll, Select, Text } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './home.style';
import { homeVM, type IHomeVM } from './home.vm';
import { useTransition } from './useTransition';

export const HomeScreen = observer(() => {
    const theme = useTheme();
    const s = useStyles();
    const styles = useStylesCommon();
    const t = useTranslate('screens.home');
    const tDictionaries = useTranslate('dictionaries');
    const tBooks = useTranslate('books');
    const transition = useTransition();

    const vm = useViewModel<IHomeVM>(homeVM);

    const onPressSearchButton = () => {
        transition.start(() => {
            vm.openSearch();
        });
    };

    return (
        <View style={styles.container}>
            <View style={s.background} />
            <Scroll contentContainerStyle={s.container} onScroll={transition.onScroll}>
                <Header title={t('title')} backButton="none" color={theme.colors.white} style={s.header} />
                <View style={s.imageContainer}>
                    <Animated.Image source={images.logo} style={[s.image, transition.styles.image]} />
                </View>
                <Animated.View style={[s.searchButton, transition.styles.input]}>
                    <Select
                        onPress={onPressSearchButton}
                        placeholder={t('search')}
                        right={<Icon name="search" color={theme.colors.textSecondary} />}
                    />
                </Animated.View>

                <View style={s.content}>
                    <Text type="h4" text={t('dictionaries')} style={s.sctionTitle} />
                    <Scroll horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scroll}>
                        {vm.dictionaries.map(item => (
                            <Card
                                key={item.id}
                                style={s.item}
                                title={tDictionaries(item.id)}
                                svg={item.svg}
                                styleInfo={styles.contentCenter}
                                onPress={() => vm.openDictionary(item.id)}
                            />
                        ))}
                    </Scroll>
                </View>
                <View style={s.content}>
                    <Text type="h4" text={t('book')} style={s.sctionTitle} />
                    <Scroll horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scroll}>
                        {vm.books.map(item => (
                            <Card
                                key={item.id}
                                style={s.item}
                                title={tBooks(item.id)}
                                svg={item.svg}
                                styleInfo={styles.contentCenter}
                                onPress={() => vm.openBook(item.id)}
                            />
                        ))}
                    </Scroll>
                </View>
                <View style={s.content}>
                    <Text type="h4" text={t('rest')} style={s.sctionTitle} />
                    <Scroll
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={s.scroll}>
                        {vm.rest.map(el => (
                            <Card
                                key={el.id}
                                style={s.item}
                                title={t(el.id)}
                                svg={el.svg}
                                styleInfo={styles.contentCenter}
                                onPress={() => vm.openRest(el.id)}
                            />
                        ))}
                    </Scroll>
                </View>
            </Scroll>
        </View>
    );
});
