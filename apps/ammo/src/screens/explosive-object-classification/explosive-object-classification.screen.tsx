import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Header, type IFlatListRenderedItem, List, TreeItem } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { type IDataItem } from './data-item.model';
import { type IExplosiveDeviceClassificationScreenProps } from './explosive-device-classification.types';
import { explosiveObjectClassificationVM, type IExplosiveObjectClassificationVM } from './explosive-object-classification.vm';

const ListItem = observer(({ item }: { item: IDataItem }) => {
    const onPress = useCallback(() => item.openItem(), [item]);

    return (
        <TreeItem
            onPress={onPress}
            lines={item.lines}
            title={item.displayName}
            isSection={item.isSection}
            isClass={item.isClass}
            isClassItem={item.isClassItem}
            deep={item.deep}
        />
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
