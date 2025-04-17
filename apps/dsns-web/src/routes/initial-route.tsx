import { observer } from 'mobx-react-lite';
import { Navigate, useLocation } from 'react-router-dom';
import { APPROVE_STATUS } from 'shared-my';

import { ROUTES } from '~/constants';
import { useStore } from '~/hooks';

export const InitialRoute = observer(() => {
    const location = useLocation();
    const store = useStore();

    const { status, permissions } = store.viewer.user ?? {};

    if (permissions?.demining.view()) {
        return <Navigate to={ROUTES.MISSION_REPORT_LIST} state={{ from: location }} replace />;
    }

    if (permissions?.ammo.viewManagement()) {
        return <Navigate to={ROUTES.EXPLOSIVE_OBJECT_TYPE} state={{ from: location }} replace />;
    }

    if (permissions?.managment.view()) {
        return <Navigate to={ROUTES.ORGANIZATIONS_LIST} state={{ from: location }} replace />;
    }

    if (status?.demining === APPROVE_STATUS.PENDING) {
        return <Navigate to={ROUTES.WAITING_APPROVE} state={{ from: location }} replace />;
    }

    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
});
