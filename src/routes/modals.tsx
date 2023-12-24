import React from 'react';

import { MODALS } from '~/constants';
import {
  EmployeesCreateModal,
  MissionReportCreateModal,
  MissionRequestCreateModal,
  OrderCreateModal,
  ExplosiveObjectCreateModal,
  ExplosiveObjectHistoryCreateModal,
  TransportCreateModal,
  EquipmentCreateModal
} from '~/modals';
import { IModalsMap } from '~/services';

export const modals: IModalsMap = {
  [MODALS.MISSION_REPORT_CREATE]: {
    renderComponent: (props: any) => <MissionReportCreateModal {...props} />,
  },
  [MODALS.MISSION_REQUEST_CREATE]: {
    renderComponent: (props: any) => <MissionRequestCreateModal {...props} />,
  },
  [MODALS.EMPLOYEES_CREATE]: {
    renderComponent: (props: any) => <EmployeesCreateModal {...props} />,
  },
  [MODALS.ORDER_CREATE]: {
    renderComponent: (props: any) => <OrderCreateModal {...props} />,
  },
  [MODALS.EXPLOSIVE_OBJECT_CREATE]: {
    renderComponent: (props: any) => <ExplosiveObjectCreateModal {...props} />,
  },
  [MODALS.EXPLOSIVE_OBJECT_HISTORY_CREATE]: {
    renderComponent: (props: any) => <ExplosiveObjectHistoryCreateModal {...props} />,
  },
  [MODALS.TRANSPORT_CREATE]: {
    renderComponent: (props: any) => <TransportCreateModal {...props} />,
  },
  [MODALS.EQUIPMENT_CREATE]: {
    renderComponent: (props: any) => <EquipmentCreateModal {...props} />,
  },
};
