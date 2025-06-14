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
    ExplosiveDeviceWizardModal,
    ExplosiveDeviceActionWizardModal,
    MapEditorModal,
    TemplateDataPreviewModal,
    ExplosiveObjectTypeWizardModal,
    ExplosiveObjectClassWizardModal,
    ExplosiveObjectClassItemWizardModal,
    ExplosiveWizardModal,
    ExplosiveCompositionWizardModal,
    ExplosiveObjectFillerWizardModal,
    BookWizardModal,
    SizeWizardModal,
    BookPluginModal,
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
    [MODALS.EXPLOSIVE_COMPOSITION]: {
        renderComponent: (props: any) => <ExplosiveCompositionWizardModal {...props} />,
    },
    [MODALS.EXPLOSIVE_WIZARD]: {
        renderComponent: (props: any) => <ExplosiveWizardModal {...props} />,
    },
    [MODALS.EXPLOSIVE_OBJECT_WIZARD]: {
        renderComponent: (props: any) => <ExplosiveObjectWizardModal {...props} />,
    },
    [MODALS.EXPLOSIVE_OBJECT_FILLER]: {
        renderComponent: (props: any) => <ExplosiveObjectFillerWizardModal {...props} />,
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
    [MODALS.BOOK_WIZARD]: {
        renderComponent: (props: any) => <BookWizardModal {...props} />,
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
    [MODALS.EXPLOSIVE_DEVICE_ACTION_WIZARD]: {
        renderComponent: (props: any) => <ExplosiveDeviceActionWizardModal {...props} />,
    },
    [MODALS.EXPLOSIVE_DEVICE_WIZARD]: {
        renderComponent: (props: any) => <ExplosiveDeviceWizardModal {...props} />,
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
    [MODALS.SIZE_WIZARD]: {
        renderComponent: (props: any) => <SizeWizardModal {...props} />,
    },
    [MODALS.BOOK_PLUGIN]: {
        renderComponent: (props: any) => <BookPluginModal {...props} />,
    },
};
