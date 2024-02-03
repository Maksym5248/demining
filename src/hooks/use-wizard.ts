import { useCallback, useState } from "react";

import { WIZARD_MODE } from "~/constants";


interface IUseWizardParams {
    id?: string;
    mode: WIZARD_MODE
  }

export const useWizard = (params: IUseWizardParams) => {
	const { mode, id} = params;

	const [currentMode, setCurrentMode] = useState<WIZARD_MODE>(mode)
    
	const isEdit = !!id && currentMode === WIZARD_MODE.EDIT;
	const isView = !!id && currentMode === WIZARD_MODE.VIEW;
	const isCreate = !id && currentMode === WIZARD_MODE.CREATE;

	const view = useCallback(() => {
		setCurrentMode(WIZARD_MODE.VIEW)
	}, [])

	const edit = useCallback(() => {
		setCurrentMode(WIZARD_MODE.EDIT)
	}, []);

	return {
		view,
		edit,
		onEdit: edit,
		onView: view,
		isEdit,
		isView,
		isCreate
	}
}