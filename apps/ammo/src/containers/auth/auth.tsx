import React from 'react';

import { observer } from 'mobx-react';

import { Button } from '~/core';
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

    const onOpenSignIn = () => vm.openSignIn();

    return (
        <>
            {!!vm.isAuthenticated && children}
            {!vm.isAuthenticated && (
                <Button.Base title={t('autenticate')} style={s.autenticate} onPress={onOpenSignIn} color={theme.colors.accent} />
            )}
        </>
    );
});
