import { Spin } from 'antd';
import { observer } from 'mobx-react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ROUTES } from '~/constants';
import { useStore } from '~/hooks';
import {
    MissionReportsListPage,
    OrdersListPage,
    MissionRequestListPage,
    ErrorNotFoundPage,
    EmployeesListPage,
    ExplosiveObjectListPage,
    TransportListPage,
    EquipmentListPage,
    SignupPage,
    DevPage,
    SettingsPage,
    LoginPage,
    WaitingApprovePage,
    OrganizationsListPage,
    MembersListPage,
    TemplatesListPage,
    ExplosiveListPage,
    HomePage,
    MapPage,
} from '~/pages';
import { nav } from '~/utils';

import { ViewAuth } from './access/view-auth';
import { ViewDev } from './access/view-dev';
import { ViewOrganization } from './access/view-organization';
import { ViewOrganizationManagment } from './access/view-organization-managment';
import { ViewOrganizationsManagment } from './access/view-organizations-managment';
import { ViewSettings } from './access/view-settings';
import { ViewWaitingApprove } from './access/view-waiting-approve';
import { InitialRoute } from './initial-route';
import { Layout } from './layout';
import { RedirectAuth } from './redirect/redirect-auth';
import { RedirectHome } from './redirect/redirect-home';
import { RedirectWaitingApprove } from './redirect/redirect-waiting-approve';

const router = createBrowserRouter([
    {
        id: 'router',
        path: '/',
        children: [
            { index: true, Component: InitialRoute },
            nav.withRedirect(
                {
                    Component: Layout,
                    children: [
                        nav.withAccess(
                            [
                                {
                                    path: ROUTES.HOME,
                                    Component: MapPage,
                                },
                                {
                                    path: ROUTES.STATISTICS,
                                    Component: HomePage,
                                },
                                {
                                    path: ROUTES.MISSION_REPORT_LIST,
                                    Component: MissionReportsListPage,
                                },
                                {
                                    path: ROUTES.MISSION_REQUEST_LIST,
                                    Component: MissionRequestListPage,
                                },
                                {
                                    path: ROUTES.ORDER_LIST,
                                    Component: OrdersListPage,
                                },
                                {
                                    path: ROUTES.EMPLOYEES_LIST,
                                    Component: EmployeesListPage,
                                },
                                {
                                    path: ROUTES.EXPLOSIVE_OBJECT_LIST,
                                    Component: ExplosiveObjectListPage,
                                },
                                {
                                    path: ROUTES.EXPLOSIVE_LIST,
                                    Component: ExplosiveListPage,
                                },
                                {
                                    path: ROUTES.TRANSPORT_LIST,
                                    Component: TransportListPage,
                                },
                                {
                                    path: ROUTES.EQUIPMENT_LIST,
                                    Component: EquipmentListPage,
                                },
                                {
                                    path: ROUTES.TEMPLATES,
                                    Component: TemplatesListPage,
                                },
                            ],
                            <ViewOrganization />,
                        ),
                        nav.withAccess(
                            {
                                path: ROUTES.MY_ORGANIZATION,
                                Component: MembersListPage,
                            },
                            <ViewOrganizationManagment />,
                        ),
                        nav.withAccess(
                            [
                                {
                                    path: ROUTES.ORGANIZATIONS_LIST,
                                    Component: OrganizationsListPage,
                                },
                                {
                                    path: ROUTES.MEMBERS_LIST,
                                    Component: MembersListPage,
                                },
                            ],
                            <ViewOrganizationsManagment />,
                        ),
                        nav.withAccess(
                            {
                                path: '/dev',
                                Component: DevPage,
                            },
                            <ViewDev />,
                        ),
                        nav.withAccess(
                            {
                                path: ROUTES.SETTINGS,
                                Component: SettingsPage,
                            },
                            <ViewSettings />,
                        ),
                    ],
                },
                <RedirectAuth />,
            ),
            nav.withRedirect(
                [
                    nav.withAccess(
                        {
                            path: ROUTES.WAITING_APPROVE,
                            Component: WaitingApprovePage,
                        },
                        <ViewWaitingApprove />,
                    ),
                    nav.withRedirect(
                        nav.withAccess(
                            [
                                {
                                    path: ROUTES.LOGIN,
                                    Component: LoginPage,
                                },
                                {
                                    path: ROUTES.SIGNUP,
                                    Component: SignupPage,
                                },
                            ],
                            <ViewAuth />,
                        ),
                        <RedirectWaitingApprove />,
                    ),
                ],
                <RedirectHome />,
            ),
            {
                path: '*',
                Component: ErrorNotFoundPage,
            },
        ],
    },
]);

const renderLoader = () => (
    <div style={{ flex: 1, background: '#4070f4' }}>
        <Spin fullscreen size="large" />
    </div>
);

export const RootRouter = observer(() => {
    const store = useStore();

    return store.isInitialized ? <RouterProvider router={router} fallbackElement={renderLoader()} /> : renderLoader();
});
