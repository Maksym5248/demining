import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { ListItem as ListItemCore, Header, type IFlatListRenderedItem, List, Text } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { type IDataItem } from './data-item.model';
import { type IExplosiveDeviceClassificationScreenProps } from './explosive-device-classification.types';
import { useStyles, ITEM_HEIGHT } from './explosive-object-classification.style';
import { explosiveObjectClassificationVM, type IExplosiveObjectClassificationVM } from './explosive-object-classification.vm';

const START_BOTTOM = 0;

const ListItem = observer(({ item }: { item: IDataItem }) => {
    const theme = useTheme();
    const s = useStyles();

    const offset = theme.spacing.M;
    const offsetHorizontal = offset * item.deep;
    const styleHorizontal = { left: offsetHorizontal - offset / 2, width: offset / 2 };

    const getStyleHorizontal = (index: number, isLast: boolean) => ({
        left: offset * index + offset / 2,
        bottom: isLast ? ITEM_HEIGHT / 2 : START_BOTTOM,
    });

    const onPress = useCallback(() => item.openItem(), [item]);
    const getTitleType = () => {
        if (item.isSection) return 'h4';
        if (item.isClass) return 'h5';
        return 'h6';
    };

    return (
        <View style={s.listItem}>
            {!!item.deep && (
                <>
                    <View style={[s.prefixHorizaontal, styleHorizontal]} />
                    {item.lines.map(({ isLast, isVisible }, index) => {
                        return isVisible ? <View key={index} style={[s.prefixVertical, getStyleHorizontal(index, isLast)]} /> : undefined;
                    })}
                </>
            )}

            <ListItemCore
                title={<Text type={getTitleType()} text={item.displayName} />}
                arrow={item.isClassItem}
                style={[s.listItemContent, { marginLeft: offsetHorizontal }, !item.isClassItem ? s.notClassItem : undefined]}
                onPress={onPress}
            />
        </View>
    );
});

export const ExplosiveObjectClassificationScreen = observer(({ route }: IExplosiveDeviceClassificationScreenProps) => {
    const theme = useTheme();
    const styles = useStylesCommon();
    const t = useTranslate('screens.explosive-object-classification');

    const vm = useViewModel<IExplosiveObjectClassificationVM>(explosiveObjectClassificationVM, route?.params);

    const renderItem = useCallback(({ item }: IFlatListRenderedItem<IDataItem>) => <ListItem item={item} />, []);

    return (
        <View style={styles.container}>
            <Header title={t('title')} backButton="back" color={theme.colors.white} />
            <List data={vm.asArray} renderItem={renderItem} ItemSeparatorComponent={() => undefined} />
        </View>
    );
});
