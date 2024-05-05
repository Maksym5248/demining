
import { observer } from 'mobx-react-lite';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';

import { useStore } from '~/hooks';
import { ROUTES } from '~/constants';

export const ViewOrganization = observer(() => {
	const store = useStore();
	const location = useLocation();
	const context = useOutletContext<any>();

	const { isOrganizationMember } = store.viewer.user ?? {};

	if (!isOrganizationMember) {
		return <Navigate to={ROUTES.NOT_FOUND} state={{ from: location }} replace />;
	}

	return <Outlet context={context} />;
});