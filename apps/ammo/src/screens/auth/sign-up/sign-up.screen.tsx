import React from 'react';

import { observer } from 'mobx-react-lite';
import { View } from 'react-native';

import { Button, KeyboardAwareScrollView, TextInput, Touchable, Text, Header } from '~/core';
import { useFocusInput, useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useTheme } from '~/styles';

import { useStyles } from './sign-up.style';
import { signUpVM } from './sign-up.vm';

export const SignUpScreen = observer(() => {
    const s = useStyles();
    const vm = useViewModel(signUpVM);
    const theme = useTheme();
    const t = useTranslate('screens.sign-up');
    const tError = useTranslate('error');

    const [refPassword, onEditedEmail] = useFocusInput();
    const [refConfirmPassword, onEditedPassword] = useFocusInput();

    const email = vm.form.field('email');
    const password = vm.form.field('password');
    const confirmPassword = vm.form.field('confirmPassword');

    const onGoToSignIn = () => vm.openSignIn();
    const onSubmit = () => vm.form.submit();
    const onPressGoogle = () => vm.signInWithGoogle.run();

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
                        blurOnSubmit={true}
                        ref={refPassword}
                        secureTextEntry
                        autoComplete="password"
                        onSubmitEditing={onEditedPassword}
                        testID="password"
                        {...password}
                        message={tError(password.error?.message, password.error)}
                    />
                    <TextInput
                        label={t('inputPassWordConfirm')}
                        blurOnSubmit={true}
                        ref={refConfirmPassword}
                        returnKeyType="done"
                        secureTextEntry
                        autoComplete="password"
                        onSubmitEditing={onSubmit}
                        testID="password"
                        {...confirmPassword}
                        message={tError(confirmPassword.error?.message, confirmPassword.error)}
                    />
                    <Button.Base title={t('button')} style={s.button} onPress={onSubmit} testID="sign_up" />
                    <Button.Google style={s.button} onPress={onPressGoogle} testID="google" />
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
