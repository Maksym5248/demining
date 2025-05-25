import { useCallback, useState } from 'react';

import { isUndefined } from 'shared-my';

import { WIZARD_MODE } from '~/constants';

interface IUseWizardParams {
    id?: string;
    mode: WIZARD_MODE;
    permissions?: {
        edit: boolean;
        remove: boolean;
    };
}

export const useWizard = (params: IUseWizardParams) => {
    const { mode, id, permissions } = params;

    const [currentMode, setCurrentMode] = useState<WIZARD_MODE>(mode);

    const isEdit = !!id && currentMode === WIZARD_MODE.EDIT;
    const isView = !!id && currentMode === WIZARD_MODE.VIEW;
    const isCreate = !id && currentMode === WIZARD_MODE.CREATE;
    const isRemove = !!isEdit;
    const isSave = isView;

    const view = useCallback(() => {
        setCurrentMode(WIZARD_MODE.VIEW);
    }, []);

    const edit = useCallback(() => {
        setCurrentMode(WIZARD_MODE.EDIT);
    }, []);

    return {
        view,
        edit,
        onEdit: edit,
        onView: view,
        isEdit: isUndefined(permissions?.remove) ? isEdit : isEdit && permissions?.edit,
        isView,
        isCreate,
        isRemove: isUndefined(permissions?.edit) ? isRemove : isRemove && permissions?.remove,
        isSave,
    };
};
