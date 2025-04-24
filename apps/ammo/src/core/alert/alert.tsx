import React from 'react';

import { View } from 'react-native';

import { Text, Button } from '~/core';
import { t } from '~/localization';

import { useStyles } from './alert.styles';
import { type IAlertProps } from './alert.types';

export const Alert = ({ title = t('core.alert.title'), subTitle, cancel = {}, confirm }: IAlertProps) => {
    const s = useStyles();

    const isTwoButtons = !!confirm;

    return (
        <View style={s.content}>
            <Text type="h4" text={String(title)} style={s.title} />
            {!!subTitle && <Text type="p2" style={s.subTitle} text={String(subTitle)} />}
            <View style={s.buttonsContainer}>
                <Button.Base
                    testID="cancelButton"
                    title={t('core.alert.cancelTitle')}
                    style={[s.cancelButton, isTwoButtons && s.cancelButtonMargin]}
                    type="invert"
                    {...cancel}
                />
                {!!confirm && (
                    <Button.Base
                        style={[s.submitButton, isTwoButtons && s.submitButtonMargin]}
                        testID="confirmButton"
                        title={t('core.alert.confirmTitle')}
                        {...confirm}
                    />
                )}
            </View>
        </View>
    );
};

Alert.displayName = 'Alert';
