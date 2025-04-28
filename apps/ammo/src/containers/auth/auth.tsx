import React from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Button, Text } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useTheme } from '~/styles';

import { type IAuthProps } from './auth.props';
import { useStyles } from './auth.style';
import { authVM, type IAuthVM } from './auth.vm';

export const Auth = observer(({ children }: IAuthProps) => {
    const theme = useTheme();
    const s = useStyles();
    const t = useTranslate('containers.auth');

    const vm = useViewModel<IAuthVM>(authVM);

    const onOpenAutentication = () => vm.openAutentication();

    return (
        <>
            {!!vm.isAuthenticated && children}
            {!vm.isRegistered && (
                <Button.Base
                    type="accent"
                    title={t('autenticate')}
                    style={s.autenticate}
                    onPress={onOpenAutentication}
                    color={theme.colors.accent}
                />
            )}
            {!vm.isEmailVerified && vm.isRegistered && (
                <View>
                    <Text style={s.emailVerefication} text={t('emailVerificationText')} />
                </View>
            )}
        </>
    );
});
