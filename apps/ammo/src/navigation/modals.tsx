import React from 'react';

import { type IModalsMap } from 'shared-my-client';

import { MODALS } from '~/constants';
import { LoadingModal } from '~/modals';

export const modals: IModalsMap = {
    [MODALS.LOADING]: {
        renderComponent: (props: any) => <LoadingModal {...props} />,
    },
};
