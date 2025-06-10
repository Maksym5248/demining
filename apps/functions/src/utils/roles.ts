import * as logger from 'firebase-functions/logger';
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

    logger.info(`User checkRoles: ${roles}`);
    logger.debug(`Claims object: ${JSON.stringify(claims)}`);
    logger.debug(`Roles to check: ${roles}`);

    const hasRole = roles.some(role => Boolean(claims[role]));
    logger.debug(`Role matching result: ${hasRole}`);

    if (hasRole) {
        logger.info(`Success: user has one of the required roles: ${roles}`);
    } else {
        logger.error(`1 Permission denied. User does not have required roles: ${roles}`);
        throw new HttpsError('permission-denied', `You do not have the required roles`);
    }
};

export const checkIdParam = (request: CallableRequest, id?: string) => {
    if (!id || typeof id !== 'string') {
        logger.error('Invalid request: bookId is missing or not a string.');
        throw new HttpsError(
            'invalid-argument',
            'The function must be called with a "bookId" string argument.',
        );
    } else {
        logger.info(`Valid bookId provided: ${id}`);
    }
};
