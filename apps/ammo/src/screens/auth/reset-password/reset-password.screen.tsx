import React from 'react';

import { observer } from 'mobx-react-lite';
import { View } from 'react-native';

import { Button, KeyboardAwareScrollView, TextInput, Header } from '~/core';
import { useStatusBar, useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';

import { useStyles } from './reset-password.style';
import { resetPasswordVM } from './reset-password.vm';

export const ResetPasswordScreen = observer(() => {
    const s = useStyles();
    const vm = useViewModel(resetPasswordVM);
    const t = useTranslate('screens.reset-password');
    const tError = useTranslate('error');

    const email = vm.form.field('email');

    const onSubmit = () => vm.form.submit();

    useStatusBar({ barStyle: 'light-content' });

    return (
        <View style={s.container}>
            <Header backButton="back" title={t('title')} />
            <KeyboardAwareScrollView contentStyle={s.contentContainer}>
                <View style={s.content}>
                    <TextInput
                        label={t('inputEmail')}
                        onSubmitEditing={onSubmit}
                        keyboardType="email-address"
                        autoComplete="email"
                        testID="email"
                        {...email}
                        message={tError(email.error?.message, email.error)}
                    />
                </View>
                <Button.Base title={t('button')} style={s.button} onPress={onSubmit} testID="submit" />
            </KeyboardAwareScrollView>
        </View>
    );
});
