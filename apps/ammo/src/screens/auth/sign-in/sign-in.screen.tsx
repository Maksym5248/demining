import React from 'react';

import { observer } from 'mobx-react-lite';
import { View } from 'react-native';

import { Button, KeyboardAwareScrollView, TextInput, Touchable, Text, Header } from '~/core';
import { useFocusInput, useStatusBar, useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useTheme } from '~/styles';

import { useStyles } from './sign-in.style';
import { signInVM } from './sign-in.vm';

export const SignInScreen = observer(() => {
    const s = useStyles();
    const vm = useViewModel(signInVM);
    const theme = useTheme();
    const t = useTranslate('screens.sign-in');
    const tError = useTranslate('error');

    const [refPassword, onEditedEmail] = useFocusInput();

    const email = vm.form.field('email');
    const password = vm.form.field('password');

    const onGoToSignUp = () => vm.openSignUp();
    const onGoToResetPassword = () => vm.openResetPassword();
    const onSubmit = () => vm.form.submit();
    const onPressGoogle = () => vm.signInWithGoogle.run();

    useStatusBar({ barStyle: 'light-content' });

    return (
        <View style={s.container}>
            <Header backButton="back" />
            <KeyboardAwareScrollView contentStyle={s.contentContainer}>
                <View style={s.titleContainer}>
                    <Text type="h1" text={t('title')} color={theme.colors.accent} />
                </View>
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
                        ref={refPassword}
                        returnKeyType="done"
                        secureTextEntry
                        autoComplete="password"
                        onSubmitEditing={vm.form.isValid ? vm.form.submit : undefined}
                        testID="password"
                        {...password}
                        message={tError(password.error?.message, password.error)}
                    />
                    <Button.Base title={t('button')} style={s.button} onPress={onSubmit} testID="sign_in" disabled={vm.form.isDisabled} />
                    <Touchable style={s.forgotPassword} testID="go_to_sign_up" onPress={onGoToResetPassword}>
                        <Text type="p3" color={theme.colors.accent} text={`${t('passWord')}  `} />
                    </Touchable>
                    <Button.Google style={s.button} onPress={onPressGoogle} testID="google" />
                </View>
                <View style={s.signUpContainer}>
                    <Text type="p2" color={theme.colors.thirdiary} text={`${t('footerAccount')} `} />
                    <Touchable testID="go_to_sign_up" onPress={onGoToSignUp}>
                        <Text type="p2" color={theme.colors.accent} text={`${t('footerSignUp')}  `} />
                    </Touchable>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
});
