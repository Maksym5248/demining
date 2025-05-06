import React from 'react';

import { observer } from 'mobx-react';

import { Field, Block } from '~/core';
import { useTranslate } from '~/localization';

import { type IDetailsProps } from './details.type';

export const Details = observer(({ item }: IDetailsProps) => {
    const t = useTranslate('screens.explosive-device-details');

    return (
        <Block title={t('details')}>
            <Field.View label={t('name')} text={item?.data.name} />
            <Field.View label={t('type')} text={item?.type?.name} />
        </Block>
    );
});
