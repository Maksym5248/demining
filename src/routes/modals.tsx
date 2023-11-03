import React from 'react';

import { MODALS } from '~/constants';
import {
  EmployeesCreateModal,
  MissionReportCreateModal,
  OrderCreateModal
} from '~/modals';
import { IModalsMap } from '~/services';

export const modals: IModalsMap = {
  [MODALS.MISSION_REPORT_CREATE]: {
    renderComponent: (props: any) => <MissionReportCreateModal {...props} />,
  },
  [MODALS.EMPLOYEES_CREATE]: {
    renderComponent: (props: any) => <EmployeesCreateModal {...props} />,
  },
  [MODALS.ORDER_CREATE]: {
    renderComponent: (props: any) => <OrderCreateModal {...props} />,
  },
};
