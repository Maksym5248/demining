import { observer } from 'mobx-react-lite';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';

import { ROUTES } from '~/constants';
import { useStore } from '~/hooks';

export const RedirectHome = observer(() => {
    const store = useStore();
    const location = useLocation();
    const context = useOutletContext<any>();

    const { isAuthorizedDSNS, isAuthor, isOrganizationMember } = store.viewer.user ?? {};

    if (isAuthorizedDSNS && isAuthor && !isOrganizationMember) {
        return <Navigate to={ROUTES.EXPLOSIVE_OBJECT_TYPES_LIST} state={{ from: location }} replace />;
    }

    if (isAuthorizedDSNS) {
        return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
    }

    return <Outlet context={context} />;
});
