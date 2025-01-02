import { type IModalsMap } from 'shared-my-client';

import { MODALS } from '~/constants';
import {
    EmployeesWizardModal,
    MissionReportWizardModal,
    MissionRequestWizardModal,
    OrderWizardModal,
    ExplosiveObjectWizardModal,
    ExplosiveObjectActionWizardModal,
    TransportWizardModal,
    EquipmentWizardModal,
    DocxPreviewModal,
    OrganizationWizardModal,
    MemberWizardModal,
    TemplateWizardModal,
    ExplosiveWizardModal,
    ExplosiveActionWizardModal,
    MapEditorModal,
    TemplateDataPreviewModal,
    ExplosiveObjectTypeWizardModal,
    ExplosiveObjectClassWizardModal,
    ExplosiveObjectClassItemWizardModal,
} from '~/modals';

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
    [MODALS.EXPLOSIVE_OBJECT_TYPE_WIZARD]: {
        renderComponent: (props: any) => <ExplosiveObjectTypeWizardModal {...props} />,
    },
    [MODALS.EXPLOSIVE_OBJECT_CLASS_WIZARD]: {
        renderComponent: (props: any) => <ExplosiveObjectClassWizardModal {...props} />,
    },
    [MODALS.EXPLOSIVE_OBJECT_CLASS_ITEM_WIZARD]: {
        renderComponent: (props: any) => <ExplosiveObjectClassItemWizardModal {...props} />,
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
    [MODALS.ORGANIZATION_WIZARD]: {
        renderComponent: (props: any) => <OrganizationWizardModal {...props} />,
    },
    [MODALS.TEMPLATE_WIZARD]: {
        renderComponent: (props: any) => <TemplateWizardModal {...props} />,
    },
    [MODALS.EXPLOSIVE_ACTION_WIZARD]: {
        renderComponent: (props: any) => <ExplosiveActionWizardModal {...props} />,
    },
    [MODALS.EXPLOSIVE_WIZARD]: {
        renderComponent: (props: any) => <ExplosiveWizardModal {...props} />,
    },
    [MODALS.MEMBER_WIZARD]: {
        renderComponent: (props: any) => <MemberWizardModal {...props} />,
    },
    [MODALS.DOCX_PREVIEW]: {
        renderComponent: (props: any) => <DocxPreviewModal {...props} />,
    },
    [MODALS.TEMPLATE_DATA_PREVIEW]: {
        renderComponent: (props: any) => <TemplateDataPreviewModal {...props} />,
    },
    [MODALS.MAP_EDITOR]: {
        renderComponent: (props: any) => <MapEditorModal {...props} />,
    },
};
