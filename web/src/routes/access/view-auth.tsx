import { observer } from 'mobx-react-lite';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';

import { useStore } from '~/hooks';
import { ROUTES } from '~/constants';

export const ViewAuth = observer(() => {
	const store = useStore();
	const location = useLocation();
	const context = useOutletContext<any>();

	const { isAuthorized } = store.viewer.user ?? {};

	if (isAuthorized) {
		return <Navigate to={ROUTES.NOT_FOUND} state={{ from: location }} replace />;
	}

	return <Outlet context={context} />;
});