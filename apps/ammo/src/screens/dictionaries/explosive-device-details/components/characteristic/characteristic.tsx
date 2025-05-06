import React from 'react';

import { observer } from 'mobx-react';

import { Field, Block } from '~/core';
import { useTranslate } from '~/localization';
import { getFillterText, viewSize } from '~/utils';

import { type ICharacteristicProps } from './characteristic.type';

export const Characteristic = observer(({ item, characteristic }: ICharacteristicProps) => {
    const t = useTranslate('screens.explosive-device-details');

    return (
        <Block title={t('characteristic')}>
            <Field.List
                label={t('size')}
                splitterItem=", "
                items={
                    item?.data?.size?.map(el => ({
                        title: viewSize(el),
                        text: el.name ? ` (${el.name})` : undefined,
                    })) ?? []
                }
                require={false}
            />
            <Field.View label={t('weight')} text={item?.data?.chargeWeight} require={false} />
            <Field.List
                label={t('fillers')}
                splitter=" - "
                items={characteristic.fillers
                    ?.sort((a, b) => (a.variant > b.variant ? 1 : -1))
                    .map(el => ({
                        prefix: el.variant ? `${el.variant}) ` : '',
                        title: `${el.explosive?.displayName ?? el.name ?? '-'}`,
                        text: getFillterText(el),
                        onPress: el.explosiveId ? () => !!el.explosiveId && characteristic.openExplosive(el.explosiveId) : undefined,
                    }))}
            />
            {item?.data.additional?.map(el => <Field.View key={el.name} label={el.name} text={el.value} require={false} />)}
        </Block>
    );
});
