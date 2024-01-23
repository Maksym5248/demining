import { MODALS } from '~/constants';
import {
	EmployeesWizardModal,
	MissionReportWizardModal,
	MissionRequestWizardModal,
	OrderWizardModal,
	ExplosiveObjectWizardModal,
	ExplosiveObjectActionWizardModal,
	TransportWizardModal,
	EquipmentWizardModal
} from '~/modals';
import { IModalsMap } from '~/services';

export const modals: IModalsMap = {
	[MODALS.MISSION_REPORT_WIZARD]: {
		renderComponent: (props: any) => <MissionReportWizardModal {...props} />,
	},
	[MODALS.MISSION_REQUEST_WIZARD]: {
		renderComponent: (props: any) => <MissionRequestWizardModal {...props} />,
	},
	[MODALS.EMPLOYEES_WIZARD]: {
		renderComponent: (props: any) => <EmployeesWizardModal {...props} />,
	},
	[MODALS.ORDER_WIZARD]: {
		renderComponent: (props: any) => <OrderWizardModal {...props} />,
	},
	[MODALS.EXPLOSIVE_OBJECT_WIZARD]: {
		renderComponent: (props: any) => <ExplosiveObjectWizardModal {...props} />,
	},
	[MODALS.EXPLOSIVE_OBJECT_ACTION_WIZARD]: {
		renderComponent: (props: any) => <ExplosiveObjectActionWizardModal {...props} />,
	},
	[MODALS.TRANSPORT_WIZARD]: {
		renderComponent: (props: any) => <TransportWizardModal {...props} />,
	},
	[MODALS.EQUIPMENT_WIZARD]: {
		renderComponent: (props: any) => <EquipmentWizardModal {...props} />,
	},
};
