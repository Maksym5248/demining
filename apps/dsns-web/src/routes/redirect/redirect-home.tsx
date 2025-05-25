import { observer } from 'mobx-react-lite';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';

import { ROUTES } from '~/constants';
import { useStore } from '~/hooks';

export const RedirectHome = observer(() => {
    const store = useStore();
    const location = useLocation();
    const context = useOutletContext<any>();

    const { permissions } = store.viewer ?? {};

    if (permissions?.documents.view()) {
        return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
    }

    if (permissions?.dictionary.view()) {
        return <Navigate to={ROUTES.EXPLOSIVE_OBJECT_LIST} state={{ from: location }} replace />;
    }

    if (permissions?.managment.view()) {
        return <Navigate to={ROUTES.ORGANIZATIONS_LIST} state={{ from: location }} replace />;
    }

    return <Outlet context={context} />;
});
