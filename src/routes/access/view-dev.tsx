import { observer } from 'mobx-react-lite';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';

import { ROUTES } from '~/constants';
import { CONFIG } from '~/config';

export const ViewDev = observer(() => {
	const location = useLocation();
	const context = useOutletContext<any>();

	if (!CONFIG.IS_DEV) {
		return <Navigate to={ROUTES.NOT_FOUND} state={{ from: location }} replace />;
	}

	return <Outlet context={context} />;
});
