import { observer } from 'mobx-react-lite';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';

import { ROUTES } from '~/constants';
import { useStore } from '~/hooks';

export const RedirectWaitingApprove = observer(() => {
    const store = useStore();
    const location = useLocation();
    const context = useOutletContext<any>();

    const { isWaitingApproved } = store.viewer.user ?? {};
    console.log('RedirectWaitingApprove', isWaitingApproved);
    if (isWaitingApproved) {
        return <Navigate to={ROUTES.WAITING_APPROVE} state={{ from: location }} replace />;
    }

    return <Outlet context={context} />;
});
