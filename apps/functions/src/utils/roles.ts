import { Logging } from '@google-cloud/logging';
import { HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { type ROLES } from 'shared-my';

const logging = new Logging();
const log = logging.log('functions-log');

export const checkAuthorized = (request: CallableRequest<any>) => {
    if (!request.auth || !request.auth.token) {
        log.write(log.entry({ severity: 'ERROR' }, 'Unauthenticated request.'));
        throw new HttpsError('unauthenticated', 'Authentication required.');
    }
};

export const checkRoles = (request: CallableRequest, roles: ROLES[]) => {
    const claims = (request.auth?.token as Record<string, unknown>) || {};

    log.write(log.entry({ severity: 'INFO' }, `User checkRoles: ${roles}`));

    const hasRole = roles.some(role => Boolean(claims[role]));

    log.write(log.entry({ severity: 'INFO' }, `Role matching result: ${hasRole}`));

    if (hasRole) {
        log.write(
            log.entry(
                { severity: 'INFO' },
                `Success: user has one of the required roles: ${roles}`,
            ),
        );
    } else {
        log.write(
            log.entry(
                { severity: 'ERROR' },
                `Permission denied. User does not have required roles: ${roles}`,
            ),
        );
        throw new HttpsError('permission-denied', `You do not have the required roles`);
    }
};

export const checkIdParam = (request: CallableRequest, id?: string) => {
    if (!id || typeof id !== 'string') {
        log.write(
            log.entry({ severity: 'ERROR' }, 'Invalid request: bookId is missing or not a string.'),
        );
        throw new HttpsError(
            'invalid-argument',
            'The function must be called with a "bookId" string argument.',
        );
    } else {
        log.write(log.entry({ severity: 'INFO' }, `Valid bookId provided: ${id}`));
    }
};
