import { observer } from 'mobx-react-lite';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';

import { CONFIG } from '~/config';
import { ROUTES } from '~/constants';

export const ViewDev = observer(() => {
    const location = useLocation();
    const context = useOutletContext<any>();

    if (!CONFIG.IS_DEV) {
        return <Navigate to={ROUTES.NOT_FOUND} state={{ from: location }} replace />;
    }

    return <Outlet context={context} />;
});
