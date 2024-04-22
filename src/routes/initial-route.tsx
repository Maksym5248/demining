import { observer } from 'mobx-react-lite';
import { Navigate, useLocation } from 'react-router-dom';

import { ROUTES } from '~/constants';
import { useStore } from '~/hooks';

export const InitialRoute = observer(() => {
	const location = useLocation();
	const store = useStore();

	const { isRootAdmin, isOrganizationMember, isWaitingApproved } = store.viewer.user ?? {};

	if(isOrganizationMember){
		return <Navigate to={ROUTES.MISSION_REPORT_LIST} state={{ from: location }} replace />;
	} if(isRootAdmin){
		return <Navigate to={ROUTES.ORGANIZATIONS_LIST} state={{ from: location }} replace />;
	} if(isWaitingApproved){
		return <Navigate to={ROUTES.WAITING_APPROVE} state={{ from: location }} replace />;
	}

	return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
});
