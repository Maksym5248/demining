import { observer } from 'mobx-react-lite';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { APPROVE_STATUS } from 'shared-my';

import { ROUTES } from '~/constants';
import { useStore } from '~/hooks';

export const ViewWaitingApprove = observer(() => {
    const store = useStore();
    const location = useLocation();
    const context = useOutletContext<any>();

    const { status } = store.viewer ?? {};

    if (status?.demining !== APPROVE_STATUS.PENDING) {
        return <Navigate to={ROUTES.NOT_FOUND} state={{ from: location }} replace />;
    }

    return <Outlet context={context} />;
});
