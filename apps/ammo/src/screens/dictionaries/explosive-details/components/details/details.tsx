import React from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Field, Block, Text, Touchable } from '~/core';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { type IDetailsProps } from './details.type';

export const Details = observer(({ item, details }: IDetailsProps) => {
    const t = useTranslate('screens.explosive-details');
    const styles = useStylesCommon();
    const theme = useTheme();

    return (
        <Block title={t('details')}>
            <Field.View label={t('name')} text={item?.data.name} />
            <Field.View label={t('fullName')} text={item?.data.fullName} />
            <Field.View label={t('formula')} text={item?.data.formula} />
            <Field.View label={t('description')} text={item?.data.description} />
            <Text type="label" style={styles.label} text={t('composition')} />
            {!details.composition?.length && <Text text="-" />}
            {details.composition?.map((el, i) => (
                <View key={i} style={[styles.row, styles.marginHorizontalXXS]}>
                    <Touchable onPress={el.explosiveId ? () => details.openExplosive(el.explosiveId ?? '') : undefined}>
                        <Text color={el.explosive ? theme.colors.link : undefined} text={el.explosive?.displayName ?? el.name ?? '-'} />
                    </Touchable>
                    <Text text={`${el.percent}%`} />
                </View>
            ))}
        </Block>
    );
});
