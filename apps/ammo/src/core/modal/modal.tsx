import React from 'react';

import ModalUI from 'react-native-modal';

import { useAndroidBackButton } from '~/hooks';

import { type IModalProps } from './modal.props';
import { useStyles } from './modal.styles';

export const Modal = ({ children, isVisible, hide, ...rest }: IModalProps) => {
    const s = useStyles();

    useAndroidBackButton(() => {
        hide();
    }, [isVisible]);

    return (
        <ModalUI
            style={s.container}
            {...rest}
            useNativeDriver
            coverScreen={false}
            backdropOpacity={0}
            isVisible={isVisible}
            onModalHide={hide}
            onBackdropPress={hide}>
            {children}
        </ModalUI>
    );
};
