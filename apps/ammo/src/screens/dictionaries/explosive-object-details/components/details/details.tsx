import React from 'react';

import { observer } from 'mobx-react';

import { Field, Block } from '~/core';
import { useTranslate } from '~/localization';

import { type IDetailsProps } from './details.type';

export const Details = observer(({ item }: IDetailsProps) => {
    const t = useTranslate('screens.explosive-object-details');

    return (
        <Block title={t('details')}>
            <Field.View label={t('name')} text={item?.data.name} />
            <Field.View label={t('fullName')} text={item?.data.fullName} require={false} />
            <Field.View label={t('type')} text={item?.type?.displayName} />
            <Field.View label={t('component')} text={item?.component?.name} />
            {item?.sortedByClass.map(classItem => (
                <Field.View
                    key={classItem.name}
                    label={`${t('classification')} ${classItem.name}`}
                    text={classItem.items.join(', ')}
                    require={false}
                />
            ))}
            <Field.View label={t('country')} text={item?.country?.displayName} />
        </Block>
    );
});
