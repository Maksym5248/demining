import { logger } from 'firebase-functions/v1';
import { HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { type ROLES } from 'shared-my';

export const checkAuthorized = (request: CallableRequest<any>) => {
    if (!request.auth || !request.auth.token) {
        logger.error('Unauthenticated request.');
        throw new HttpsError('unauthenticated', 'Authentication required.');
    }
};

export const checkRoles = (request: CallableRequest, roles: ROLES[]) => {
    const claims = (request.auth?.token as Record<string, unknown>) || {};

    logger.info(`User checkRoles: ${roles}`, {
        uid: request.auth?.uid,
        claims,
        roles,
    });

    if (roles.some(role => claims[role])) {
        logger.info(`Succes: user have one of required roles${roles}`, {
            uid: request.auth?.uid,
            claims,
            roles,
        });
    } else {
        logger.error(`Permission denied. User does not have required roles: ${roles}`, {
            uid: request.auth?.uid,
            claims,
            roles,
        });

        throw new HttpsError('permission-denied', `You do not have the required roles`);
    }
};

export const checkIdParam = (request: CallableRequest, id?: string) => {
    if (!id || typeof id !== 'string') {
        logger.error('Invalid request: bookId is missing or not a string.', request.data);

        throw new HttpsError(
            'invalid-argument',
            'The function must be called with a "bookId" string argument.',
        );
    } else {
        logger.info(`Valid bookId provided: ${id}`, request.data);
    }
};
