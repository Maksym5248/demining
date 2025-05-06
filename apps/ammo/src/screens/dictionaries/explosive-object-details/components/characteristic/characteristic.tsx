import React from 'react';

import { observer } from 'mobx-react';
import { EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { Field, Block } from '~/core';
import { useTranslate } from '~/localization';
import { getFillterText, getTemurature, viewSize } from '~/utils';

import { type ICharacteristicProps } from './characteristic.type';

export const Characteristic = observer(({ characteristic }: ICharacteristicProps) => {
    const t = useTranslate('screens.explosive-object-details');

    const { item } = characteristic;
    const { details } = item ?? {};

    return (
        <Block title={t('characteristic')}>
            <Field.View label={t('caliber')} text={details?.data.caliber} require={false} />
            {item?.component?.id === EXPLOSIVE_OBJECT_COMPONENT.AMMO && (
                <Field.List
                    label={t('fuse')}
                    splitterItem=", "
                    type="horizontal"
                    require={false}
                    items={characteristic.fuses?.map(el => ({
                        title: el?.displayName,
                        onPress: () => characteristic.openExplosiveObject(el.data.id ?? ''),
                    }))}
                />
            )}
            {item?.component?.id !== EXPLOSIVE_OBJECT_COMPONENT.FERVOR && (
                <Field.List
                    label={t('fervor')}
                    require={false}
                    splitterItem=", "
                    type="horizontal"
                    items={characteristic.fervor?.map(el => ({
                        title: el?.displayName,
                        onPress: () => characteristic.openExplosiveObject(el.data.id ?? ''),
                    }))}
                />
            )}
            <Field.View label={t('targetSensor')} text={details?.data.targetSensor} require={false} />
            <Field.Range label={t('sensitivityEffort')} value={details?.data.sensitivity?.effort} require={false} />
            <Field.View label={t('sensitivity')} text={details?.data.sensitivity?.sensitivity} require={false} />
            {details?.data.sensitivity?.additional?.map(el => <Field.View key={el.name} label={el.name} text={el.value} require={false} />)}
            <Field.View label={t('liquidatorShort')} text={details?.data.liquidatorShort} require={false} />
            <Field.View label={t('foldingShort')} text={details?.data.foldingShort} require={false} />
            <Field.View label={t('extractionShort')} text={details?.data.extractionShort} require={false} />
            <Field.Range label={t('demageRadius')} value={details?.data.damage?.radius} info={t('demageRadiusInfo')} require={false} />
            <Field.Range label={t('demageDistance')} value={details?.data.damage?.distance} require={false} />
            <Field.Range label={t('demageSquad')} value={details?.data.damage?.squad} require={false} />
            <Field.Range label={t('demageHeight')} value={details?.data.damage?.height} require={false} />
            <Field.Range label={t('demageNumber')} value={details?.data.damage?.number} require={false} />
            <Field.View label={t('demageAction')} text={details?.data.damage?.action} require={false} />
            {details?.data.damage?.additional?.map(el => <Field.View key={el.name} label={el.name} text={el.value} require={false} />)}
            <Field.View label={t('timeWork')} text={details?.data.timeWork} require={false} />
            <Field.List
                label={t('material')}
                splitterItem=", "
                type="horizontal"
                items={details?.materials?.map(el => ({
                    title: el.name,
                }))}
            />
            <Field.List
                label={t('size')}
                splitterItem=", "
                items={
                    details?.data?.size?.map(el => ({
                        title: viewSize(el),
                        text: el.name ? ` (${el.name})` : undefined,
                    })) ?? []
                }
                require={false}
            />
            <Field.List
                label={t('weight')}
                splitterItem=", "
                type="horizontal"
                items={details?.data?.weight?.map(el => ({
                    title: el.weight,
                }))}
                require={false}
            />
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
            <Field.Range label={t('temperature')} value={getTemurature(details?.data.temperature)} require={false} />
            {details?.data.additional?.map(el => <Field.View key={el.name} label={el.name} text={el.value} require={false} />)}
            <Field.View label={t('description')} text={item?.data.description} require={false} />
        </Block>
    );
});
