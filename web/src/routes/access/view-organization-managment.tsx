import { observer } from 'mobx-react-lite';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';

import { useStore } from '~/hooks';
import { ROUTES } from '~/constants';

export const ViewOrganizationManagment = observer(() => {
	const store = useStore();
	const location = useLocation();
	const context = useOutletContext<any>();

	const { isOrganizationAdmin } = store.viewer.user ?? {};

	if (!isOrganizationAdmin) {
		return <Navigate to={ROUTES.NOT_FOUND} state={{ from: location }} replace />;
	}

	return <Outlet context={context} />;
});
