import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Chips, Link, Text } from '~/core';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './explosive-object.style';
import { type IExplosiveObjectProps } from './explosive-object.type';

export const ExplosiveObject = observer(({ model }: IExplosiveObjectProps) => {
    const s = useStyles();
    const styles = useStylesCommon();
    const theme = useTheme();
    const t = useTranslate('modals.filter-dictionaries.explosive-object');

    const onPressSelect = () => {
        model.openSelect();
    };

    const onRemoveType = () => {
        model.removeType();
    };

    return (
        <View style={s.container}>
            <View style={[styles.gapXS, styles.marginHorizontalS]}>
                <View style={styles.row}>
                    <Text type="h6" color={theme.colors.accent}>
                        {t('type')}
                    </Text>
                    <Link text={t('viewAll')} onPress={onPressSelect} arrow />
                </View>
                <Chips options={model.type} onRemove={onRemoveType} />
            </View>
        </View>
    );
});
