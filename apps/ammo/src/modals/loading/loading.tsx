import React from 'react';

import { Loading, Modal } from '~/core';
import { useStylesCommon } from '~/styles';

import { type ILoadingProps } from './loading.type';

export const LoadingModal = (props: ILoadingProps) => {
    const s = useStylesCommon();

    return (
        <Modal style={s.modal} {...props}>
            <Loading isVisible size="large" />
        </Modal>
    );
};
