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
    const transition = useTransition();

    const vm = useViewModel<IHomeVM>(homeVM);

    const onPressSearchButton = () => {
        transition.start(() => {
            vm.openSearch();
        });
    };

    return (
        <Scroll contentContainerStyle={styles.container} bounces={false}>
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
                <Text type="h4" text={t('categories')} />
                <View style={s.categories}>
                    {vm.categories.map(category => (
                        <Card
                            key={category.id}
                            style={s.item}
                            title={category.type ? tDictionaries(category.type) : t('settings')}
                            svg={category.svg}
                            styleInfo={styles.contentCenter}
                            onPress={() => vm.openCategory(category.id)}
                        />
                    ))}
                </View>
            </View>
        </Scroll>
    );
});
