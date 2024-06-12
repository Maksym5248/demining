import { useLocation, useParams } from 'react-router-dom';

import { nav } from '~/utils';

export const useRouteTitle = () => {
    const location = useLocation();
    const params = useParams();

    return nav.getRouteTitleByLocation(location.pathname, params as { [key: string]: string | number });
};
