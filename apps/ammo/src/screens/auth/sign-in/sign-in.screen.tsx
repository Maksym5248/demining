import React from 'react';

import { View } from 'react-native';

import { SCREENS } from '~/constants';
import { Button, KeyboardAwareScrollView, TextInput, Touchable, Text, Header } from '~/core';
import { useFocusInput, useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { Navigation } from '~/services';
import { useTheme } from '~/styles';

import { useStyles } from './sign-in.style';
import { signInVM } from './sign-in.vm';

// TODO:
// 1. implement forgot password
// 2. email confirmation link to app

export const SignInScreen = () => {
    const s = useStyles();
    const vm = useViewModel(signInVM);
    const theme = useTheme();
    const t = useTranslate('screens.sign-in');

    const [refPassword, onEditedEmail] = useFocusInput();

    // const email = vm.form.fields.get('email');
    // const password = vm.form.fields.get('password');

    const onGoToSignUp = () => {
        Navigation.push(SCREENS.SIGN_UP);
    };

    const onSubmit = () => {
        vm.form.submit();
    };

    return (
        <View style={s.container}>
            <KeyboardAwareScrollView contentStyle={s.contentContainer}>
                <Header title={t('title')} backButton="back" />
                <TextInput
                    label={t('inputEmail')}
                    onSubmitEditing={onEditedEmail}
                    keyboardType="email-address"
                    // autoCompleteType="email"
                    testID="email"
                    // {...email.bind()}
                />
                <TextInput
                    label={t('inputPassWord')}
                    style={s.inputPassword}
                    blurOnSubmit={true}
                    ref={refPassword}
                    returnKeyType="done"
                    secureTextEntry
                    // autoCompleteType="password"
                    // onSubmitEditing={vm.form.isValid ? vm.form.submit : undefined}
                    testID="password"
                    // {...password.bind()}
                />
                <Button.Base title={t('button')} style={s.button} onPress={onSubmit} testID="sign_in" />
                <Touchable style={s.forgotPassword} testID="go_to_sign_up">
                    <Text type="p3" color={theme.colors.accent} text={`${t('passWord')}  `} />
                </Touchable>
                <View style={s.signUpContainer}>
                    <Text type="p2" color={theme.colors.thirdiary} text={`${t('footerAccount')} `} />
                    <Touchable testID="go_to_sign_up" onPress={onGoToSignUp}>
                        <Text type="p2" color={theme.colors.accent} text={`${t('footerSignUp')}  `} />
                    </Touchable>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};
