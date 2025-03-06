import { Fragment } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Chips, Link, Separator, Text } from '~/core';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './explosive-device.style';
import { type IExplosiveDeviceProps } from './explosive-device.type';

export const ExplosiveDevice = observer(({ model }: IExplosiveDeviceProps) => {
    const s = useStyles();
    const styles = useStylesCommon();
    const theme = useTheme();
    const t = useTranslate('modals.filter-dictionaries.explosive-device');

    const onPressTypeSelect = () => {
        model.openTypeSelect();
    };

    const onRemoveType = () => {
        model.removeType();
    };

    const items = [
        <View key="type" style={[styles.gapXS, styles.marginHorizontalS]}>
            <View style={styles.row}>
                <Text type="h5" color={theme.colors.accent} text={t('type')} />
                <Link text={t('viewAll')} onPress={onPressTypeSelect} arrow />
            </View>
            <Chips options={model.type} onRemove={onRemoveType} placeholder={t('notSelected')} />
        </View>,
    ];

    return (
        <View style={s.container}>
            {items.map((item, index) => (
                <Fragment key={index}>
                    {item}
                    {index < items.length - 1 && <Separator />}
                </Fragment>
            ))}
        </View>
    );
});
