import React from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Card, Header, Icon, Svg, Text, Touchable } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './home.style';
import { homeVM, type IHomeVM } from './home.vm';

export const HomeScreen = observer(() => {
    const theme = useTheme();
    const s = useStyles();
    const styles = useStylesCommon();
    const t = useTranslate('screens.home');

    const vm = useViewModel<IHomeVM>(homeVM);

    return (
        <View style={styles.container}>
            <Header title={t('title')} backButton="none" color={theme.colors.white} style={s.header} />
            <View style={s.imageContainer}>
                <Svg name="logo" style={s.image} />
            </View>
            <Touchable style={s.searchButton} contentStyle={s.searchButtonContent}>
                <Text type="p4" text={t('search')} color={theme.colors.textSecondary} />
                <Icon name="search" color={theme.colors.textSecondary} />
            </Touchable>

            <View style={s.content}>
                <Text type="h4" text={t('categories')} />
                <View style={s.categories}>
                    {vm.categories.map(category => (
                        <Card key={category.id} style={s.item} title={t(category.type)} svg={category.svg} />
                    ))}
                </View>
            </View>
        </View>
    );
});
