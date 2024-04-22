import { observer } from 'mobx-react-lite';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';

import { useStore } from '~/hooks';
import { ROUTES } from '~/constants';

export const ViewOrganizationsManagment = observer(() => {
	const store = useStore();
	const location = useLocation();
	const context = useOutletContext<any>();

	const { isRootAdmin } = store.viewer.user ?? {};

	if (!isRootAdmin) {
		return <Navigate to={ROUTES.NOT_FOUND} state={{ from: location }} replace />;
	}

	return <Outlet context={context} />;
});

