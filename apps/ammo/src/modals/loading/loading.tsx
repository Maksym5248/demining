import React from 'react';

import { Loading, Modal } from '~/core';
import { useStylesCommon } from '~/styles';

import { type ILoadingProps } from './loading.type';

export const LoadingModal = (props: ILoadingProps) => {
    const styles = useStylesCommon();

    return (
        <Modal style={styles.modal} {...props}>
            <Loading isVisible size="large" />
        </Modal>
    );
};
