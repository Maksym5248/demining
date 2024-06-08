import get from 'lodash/get';

const getMessage = (e: Error) =>
    get(e, 'response.data.message') || get(e, 'message') || 'errors.unexpected_error';

const createError = (e: Error) => ({
    message: getMessage(e),
    status: get(e, 'response.status', null),
    reason: get(e, 'response.data.reason', null),
});

const getErrorTranslation = (e?: { message: string } | null) => {
    let res = null;

    if (e?.message?.includes('auth/invalid-login-credentials')) {
        res = {
            message: 'Неправильно введені пароль або емейл',
            field: 'email',
        };
    }

    return res;
};

export const error = {
    getErrorTranslation,
    getMessage,
    createError,
};
