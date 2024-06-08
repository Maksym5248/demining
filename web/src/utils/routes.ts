import { isArray } from 'lodash';
import { RouteObject } from 'react-router-dom';

import { ROUTES, routesInfo } from '~/constants';

const getBasePath = (pathname: string, params: { [key: string]: string | number }) => {
    let path = pathname;
    const paramsValues = Object.keys(params || {});

    paramsValues.forEach((key) => {
        const value = params[key];
        path = path.replace(`${value}`, `:${key}`);
    });

    return path as ROUTES;
};

const getRouteTitle = (value: ROUTES) => {
    let res = '';

    if (routesInfo[value]) {
        res = routesInfo[value].title;
    }

    return res;
};

const getRouteTitleByLocation = (value: string, params: { [key: string]: string | number }) => {
    const route = getBasePath(value, params);

    return getRouteTitle(route);
};

const getRoutes = (pathname: string, params: { [key: string]: string | number }) => {
    const path = getBasePath(pathname, params);

    const routes = path.split('/');
    const pathnames = pathname.split('/');

    routes.shift();
    pathnames.shift();

    return routes
        .map((pathStr, i) => ({
            route: `/${routes.slice(0, i + 1).join('/')}`,
            path: pathStr,
        }))
        .filter(({ route }) => !!routesInfo[route as ROUTES])
        .map(({ route }, i) => ({
            path: pathnames[i],
            route,
            title: getRouteTitle(route as ROUTES),
        }));
};

export const withRouteWrapper = (
    route: RouteObject | RouteObject[],
    elements: JSX.Element | JSX.Element[],
): RouteObject => {
    const arr = Array.isArray(elements) ? elements : [elements];
    const reversedArr = arr.reverse();

    return reversedArr.reduce(
        (acc, element) => ({
            element,
            children: isArray(acc) ? acc : [acc],
        }),
        route,
    ) as RouteObject;
};

export const nav = {
    withAccess: withRouteWrapper,
    withRedirect: withRouteWrapper,
    getRouteTitle,
    getRouteTitleByLocation,
    getRoutes,
};
