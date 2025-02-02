import React from 'react';

import { Loading as LoadingComponent, Modal } from '~/core';

import { useStyles } from './loading.styles';
import { type ILoadingProps } from './loading.type';

export const LoadingModal = (props: ILoadingProps) => {
    const s = useStyles();

    return (
        <Modal style={s.container} {...props}>
            <LoadingComponent isVisible />
        </Modal>
    );
};
