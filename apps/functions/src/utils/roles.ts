import { HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { type ROLES } from 'shared-my';

export const checkAuthorized = (request: CallableRequest<any>) => {
    if (!request.auth || !request.auth.token) {
        console.error('Unauthenticated request.');
        throw new HttpsError('unauthenticated', 'Authentication required.');
    }
};

export const checkRoles = (request: CallableRequest, roles: ROLES[]) => {
    const claims = (request.auth?.token as Record<string, unknown>) || {};

    console.info(`User checkRoles: ${roles}`, {
        uid: request.auth?.uid,
        claims,
        roles,
    });

    const hasRole = roles.some(role => Boolean(claims[role]));

    console.info('Role matching result:', hasRole);

    if (hasRole) {
        console.info(`Success: user has one of the required roles: ${roles}`, {
            uid: request.auth?.uid,
            claims,
            roles,
        });
    } else {
        console.error(`Permission denied. User does not have required roles: ${roles}`, {
            uid: request.auth?.uid,
            claims,
            roles,
        });
        throw new HttpsError('permission-denied', `You do not have the required roles`);
    }
};

export const checkIdParam = (request: CallableRequest, id?: string) => {
    if (!id || typeof id !== 'string') {
        console.error('Invalid request: bookId is missing or not a string.', request.data);

        throw new HttpsError(
            'invalid-argument',
            'The function must be called with a "bookId" string argument.',
        );
    } else {
        console.info(`Valid bookId provided: ${id}`, request.data);
    }
};
