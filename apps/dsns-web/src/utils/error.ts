import get from 'lodash/get';
import { ERROR_MESSAGE } from 'shared-my';
import { type IErrorModel } from 'shared-my-client';

const getMessage = (e: Error) => get(e, 'response.data.message') || get(e, 'message') || 'errors.unexpected_error';

const createError = (e: Error) => ({
    message: getMessage(e),
    status: get(e, 'response.status', null),
    reason: get(e, 'response.data.reason', null),
});

const getErrorTranslation = (e?: IErrorModel) => {
    let res = null;

    if (e?.fields.find(el => el.message === ERROR_MESSAGE.WRONG_EMAIL_OR_PASSWORD)) {
        res = {
            message: 'Неправильно введені пароль або емейл',
            field: ERROR_MESSAGE.WRONG_EMAIL_OR_PASSWORD,
        };
    }

    return res;
};

export const error = {
    getErrorTranslation,
    getMessage,
    createError,
};
