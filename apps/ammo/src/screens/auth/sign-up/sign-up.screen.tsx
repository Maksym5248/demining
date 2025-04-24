import React from 'react';

import { observer } from 'mobx-react-lite';
import { View } from 'react-native';

import { SCREENS } from '~/constants';
import { Button, KeyboardAwareScrollView, TextInput, Touchable, Text, Header } from '~/core';
import { useFocusInput, useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { Navigation } from '~/services';
import { useTheme } from '~/styles';

import { useStyles } from './sign-up.style';
import { signUpVM } from './sign-up.vm';

export const SignUpScreen = observer(() => {
    const s = useStyles();
    const vm = useViewModel(signUpVM);
    const theme = useTheme();
    const t = useTranslate('screens.sign-up');
    const tError = useTranslate();

    const [refPassword, onEditedEmail] = useFocusInput();

    const email = vm.form.field('email');
    const password = vm.form.field('password');

    const onGoToSignIn = () => Navigation.navigate(SCREENS.SIGN_IN);
    const onSubmit = () => vm.form.submit();

    return (
        <View style={s.container}>
            <Header backButton="back" title={t('title')} />
            <KeyboardAwareScrollView contentStyle={s.contentContainer}>
                <View />
                <View>
                    <TextInput
                        label={t('inputEmail')}
                        onSubmitEditing={onEditedEmail}
                        keyboardType="email-address"
                        autoComplete="email"
                        testID="email"
                        {...email}
                        message={tError(email.error?.message, email.error)}
                    />
                    <TextInput
                        label={t('inputPassWord')}
                        style={s.inputPassword}
                        blurOnSubmit={true}
                        ref={refPassword}
                        returnKeyType="done"
                        secureTextEntry
                        autoComplete="password"
                        onSubmitEditing={vm.form.isValid ? vm.form.submit : undefined}
                        testID="password"
                        {...password}
                        message={tError(password.error?.message, password.error)}
                    />
                    <Button.Base title={t('button')} style={s.button} onPress={onSubmit} testID="sign_up" />
                </View>
                <View style={s.signUpContainer}>
                    <Text type="p2" color={theme.colors.thirdiary} text={`${t('footerAccount')} `} />
                    <Touchable testID="go_to_sign_up" onPress={onGoToSignIn}>
                        <Text type="p2" color={theme.colors.accent} text={`${t('footerSignIn')}  `} />
                    </Touchable>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
});
