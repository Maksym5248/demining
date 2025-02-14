import { Fragment } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Chips, Link, Separator, Text } from '~/core';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './explosive-object.style';
import { type IExplosiveObjectProps } from './explosive-object.type';

export const ExplosiveObject = observer(({ model }: IExplosiveObjectProps) => {
    const s = useStyles();
    const styles = useStylesCommon();
    const theme = useTheme();
    const t = useTranslate('modals.filter-dictionaries.explosive-object');

    const onPressTypeSelect = () => {
        model.openTypeSelect();
    };

    const onPressClassificationSelect = () => {
        model.openClassificationSelect();
    };

    const onRemoveType = () => {
        model.removeType();
    };

    const onRemoveClassItem = () => {
        model.removeClassItem();
    };

    const items = [
        <View key="type" style={[styles.gapXS, styles.marginHorizontalS]}>
            <View style={styles.row}>
                <Text type="h6" color={theme.colors.accent} text={t('type')} />
                <Link text={t('viewAll')} onPress={onPressTypeSelect} arrow />
            </View>
            <Chips options={model.type} onRemove={onRemoveType} placeholder={t('notSelected')} />
        </View>,
    ];

    if (model.type) {
        items.push(
            <View key="classification" style={[styles.gapXS, styles.marginHorizontalS]}>
                <View style={styles.row}>
                    <Text type="h6" color={theme.colors.accent} text={t('classification')} />
                    <Link text={t('viewAll')} onPress={onPressClassificationSelect} arrow />
                </View>
                <Chips options={model.classItem} onRemove={onRemoveClassItem} placeholder={t('notSelected')} />
            </View>,
        );
    }

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
