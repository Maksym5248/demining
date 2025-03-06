import { Fragment } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import { type EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { Chips, Link, Separator, Text } from '~/core';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';
import { type IOption } from '~/types';

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

    const onPressCountrySelect = () => {
        model.openCountrySelect();
    };

    const onPressComponentSelect = () => {
        model.openComponentSelect();
    };

    const onRemoveType = () => {
        model.removeType();
    };

    const onRemoveClassItem = (option: IOption<string>) => {
        model.removeClassItem(option.value);
    };

    const onRemoveCountry = (option: IOption<string>) => {
        model.removeCountry(option.value);
    };

    const onRemoveComponent = (option: IOption<EXPLOSIVE_OBJECT_COMPONENT>) => {
        model.removeComponent(option.value);
    };

    const items = [
        <View key="component" style={[styles.gapXS, styles.marginHorizontalS]}>
            <View style={styles.row}>
                <Text type="h5" color={theme.colors.accent} text={t('component')} />
                <Link text={t('viewAll')} onPress={onPressComponentSelect} arrow />
            </View>
            <Chips options={model.components} onRemove={onRemoveComponent} placeholder={t('notSelected')} />
        </View>,
        <View key="country" style={[styles.gapXS, styles.marginHorizontalS]}>
            <View style={styles.row}>
                <Text type="h5" color={theme.colors.accent} text={t('country')} />
                <Link text={t('viewAll')} onPress={onPressCountrySelect} arrow />
            </View>
            <Chips options={model.countries} onRemove={onRemoveCountry} placeholder={t('notSelected')} />
        </View>,
        <View key="type" style={[styles.gapXS, styles.marginHorizontalS]}>
            <View style={styles.row}>
                <Text type="h5" color={theme.colors.accent} text={t('type')} />
                <Link text={t('viewAll')} onPress={onPressTypeSelect} arrow />
            </View>
            <Chips options={model.type} onRemove={onRemoveType} placeholder={t('notSelected')} />
        </View>,
    ];

    if (model.type) {
        items.push(
            <View key="classification" style={[styles.gapXS, styles.marginHorizontalS]}>
                <View style={styles.row}>
                    <Text type="h5" color={theme.colors.accent} text={t('classification')} />
                    <Link text={t('viewAll')} onPress={onPressClassificationSelect} arrow />
                </View>
                <Chips options={model.classItems} onRemove={onRemoveClassItem} placeholder={t('notSelected')} />
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
