import React from 'react';

import { observer } from 'mobx-react';

import { Field, Block } from '~/core';
import { useTranslate } from '~/localization';

import { type ICharacteristicPhisicalProps } from './characteristic-phisical.type';

export const CharacteristicPhisical = observer(({ item }: ICharacteristicPhisicalProps) => {
    const t = useTranslate('screens.explosive-details');

    const { density, meltingPoint, ignitionPoint } = item?.data?.physical ?? {};

    return (
        <Block title={t('phisicalCharacteristic')}>
            <Field.Range label={t('density')} value={[density?.min, density?.max]} require />
            <Field.Range label={t('meltingPoint')} value={[meltingPoint?.min, meltingPoint?.max]} require />
            <Field.Range label={t('ignitionPoint')} value={[ignitionPoint?.min, ignitionPoint?.max]} require />
        </Block>
    );
});
