import React from 'react';

import { type IModalsMap } from 'shared-my-client';

import { MODALS } from '~/constants';
import * as modalsComponents from '~/modals';

export const modals: IModalsMap = {
    [MODALS.LOADING]: {
        renderComponent: (props: any) => <modalsComponents.LoadingModal {...props} />,
    },
    [MODALS.GALLERY]: {
        renderComponent: (props: any) => <modalsComponents.GalleryModal {...props} />,
    },
    [MODALS.FILTER_DICTIONARY]: {
        renderComponent: (props: any) => <modalsComponents.FilterDictionariesModal {...props} />,
    },
    [MODALS.FILTER_BOOKS]: {
        renderComponent: (props: any) => <modalsComponents.FilterBooksModal {...props} />,
    },
    [MODALS.SELECT]: {
        renderComponent: (props: any) => <modalsComponents.SelectModal {...props} />,
    },
    [MODALS.EXPLOSIVE_OBJECT_CLASSIFICATION]: {
        renderComponent: (props: any) => <modalsComponents.ExplosiveObjectClassificationModal {...props} />,
    },
};
