import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import { type INode } from 'shared-my-client';

import { Card, Header, type IFlatListRenderedItem, List } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { type IExplosiveDeviceClassificationScreenProps } from './explosive-device-classification.types';
import { useStyles } from './explosive-object-classification.style';
import { explosiveObjectClassificationVM, type IExplosiveObjectClassificationVM } from './explosive-object-classification.vm';

const ListItem = observer(({ item }: { item: INode }) => {
    return <Card title={item.displayName} />;
});

export const ExplosiveObjectClassificationScreen = observer(({ route }: IExplosiveDeviceClassificationScreenProps) => {
    const theme = useTheme();
    const s = useStyles();
    const styles = useStylesCommon();
    const t = useTranslate('screens.explosive-object-classification');

    const vm = useViewModel<IExplosiveObjectClassificationVM>(explosiveObjectClassificationVM, route?.params);

    const renderItem = useCallback(({ item }: IFlatListRenderedItem<INode>) => <ListItem item={item} />, []);

    return (
        <View style={styles.container}>
            <Header title={t('title')} backButton="back" color={theme.colors.white} />
            <List data={vm.asArray} renderItem={renderItem} style={s.flatList} />
        </View>
    );
});
