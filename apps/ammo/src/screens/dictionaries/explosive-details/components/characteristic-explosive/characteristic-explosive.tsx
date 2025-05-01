import React from 'react';

import { observer } from 'mobx-react';
import { measurement } from 'shared-my';

import { Field, Block } from '~/core';
import { useTranslate } from '~/localization';

import { type ICharacteristicExplosiveProps } from './characteristic-explosive.type';

export const CharacteristicExplosive = observer(({ item }: ICharacteristicExplosiveProps) => {
    const t = useTranslate('screens.explosive-details');

    const { brisantness, velocity, explosiveness, tnt } = item?.data?.explosive ?? {};
    const { shock, temperature, friction } = item?.data?.sensitivity ?? {};

    return (
        <Block title={t('explosiveCharacteristic')}>
            <Field.Range label={t('detonationSpeed')} value={[velocity?.min, velocity?.max]} />
            <Field.Range
                label={t('brisance')}
                info={t('brisanceTooltip')}
                value={[
                    brisantness?.min ? measurement.mToMm(brisantness.min) : undefined,
                    brisantness?.max ? measurement.mToMm(brisantness.max) : undefined,
                ]}
            />
            <Field.Range
                label={t('explosiveVolume')}
                info={t('explosiveVolumeTooltip')}
                value={[
                    explosiveness?.min ? measurement.m3ToCm3(explosiveness.min) : undefined,
                    explosiveness?.max ? measurement.m3ToCm3(explosiveness.max) : undefined,
                ]}
            />
            <Field.Range label={t('trotylEquivalent')} value={[tnt?.min, tnt?.max]} />
            <Field.View label={t('sensitivityToImpact')} text={shock} />
            <Field.View label={t('sensitivityToTemperature')} text={temperature} />
            <Field.View label={t('sensitivityToFriction')} text={friction} />
        </Block>
    );
});
