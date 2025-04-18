import { observer } from 'mobx-react-lite';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';

import { ROUTES } from '~/constants';
import { useStore } from '~/hooks';

export const ViewOrganizationManagment = observer(() => {
    const store = useStore();
    const location = useLocation();
    const context = useOutletContext<any>();

    const { permissions } = store.viewer ?? {};

    if (!permissions?.demining?.viewManagement()) {
        return <Navigate to={ROUTES.NOT_FOUND} state={{ from: location }} replace />;
    }

    return <Outlet context={context} />;
});
