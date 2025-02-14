import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { ListItem as ListItemCore, Header, type IFlatListRenderedItem, List } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { type IDataItem } from './data-item.model';
import { explosiveObjectTypeVM, type IExplosiveObjectTypeVM } from './explosive-object-type.vm';

const ListItem = observer(({ item }: { item: IDataItem }) => {
    const onPress = () => item.openItem();
    return <ListItemCore type="image" title={item.displayName} uri={item.imageUri} onPress={onPress} />;
});

export const ExplosiveObjectTypeScreen = observer(() => {
    const theme = useTheme();
    const styles = useStylesCommon();
    const t = useTranslate('screens.explosive-object-type');

    const vm = useViewModel<IExplosiveObjectTypeVM>(explosiveObjectTypeVM);

    const renderItem = useCallback(({ item }: IFlatListRenderedItem<IDataItem>) => <ListItem item={item} />, []);

    return (
        <View style={styles.container}>
            <Header title={t('title')} backButton="back" color={theme.colors.white} />
            <List data={vm.asArray} renderItem={renderItem} />
        </View>
    );
});
