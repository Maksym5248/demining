import { observer } from 'mobx-react-lite';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';

import { ROUTES } from '~/constants';
import { useStore } from '~/hooks';

export const ViewSettings = observer(() => {
    const store = useStore();
    const location = useLocation();
    const context = useOutletContext<any>();

    const { isAuthorizedDSNS } = store.viewer.user ?? {};

    if (!isAuthorizedDSNS) {
        return <Navigate to={ROUTES.NOT_FOUND} state={{ from: location }} replace />;
    }

    return <Outlet context={context} />;
});
