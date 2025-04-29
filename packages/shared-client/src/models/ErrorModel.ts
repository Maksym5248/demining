import get from 'lodash/get';
import { ERROR_FIELD, ERROR_MESSAGE } from 'shared-my';

export interface IErrorField {
    field: ERROR_FIELD;
    message: ERROR_MESSAGE;
}

export interface IErrorModel {
    message: string;
    status: number | null;
    fields: IErrorField[];
    isFieldError: boolean;
}

const values = Object.values(ERROR_MESSAGE);
export class ErrorModel implements IErrorModel {
    data: unknown;

    message: ERROR_MESSAGE;
    status: number | null;
    fields: IErrorField[] = [];

    constructor(e: unknown) {
        if (e instanceof ErrorModel) {
            this.data = e.data;
            this.message = e.message;
            this.status = e.status;
            this.fields = e.fields;
        } else {
            this.data = e;
            this.message = this.getMessage(e);
            this.status = this.getStatus(e);
            this.fields = this.getFields(e);
        }
    }

    private getMessage(e: any) {
        return values.includes(e?.message) ? e?.message : ERROR_MESSAGE.UNEXPECTED;
    }

    private getStatus(e: any) {
        return get(e, 'response.status', null);
    }

    private getFields(e: any) {
        const res = [];

        if (e?.message?.includes('[auth/invalid-credential] The supplied auth credential is incorrect, malformed or has expired')) {
            res.push({
                message: ERROR_MESSAGE.WRONG_EMAIL_OR_PASSWORD,
                field: ERROR_FIELD.EMAIL,
            });
        } else if (e?.message?.includes('auth/invalid-login-credentials')) {
            res.push({
                message: ERROR_MESSAGE.WRONG_EMAIL_OR_PASSWORD,
                field: ERROR_FIELD.EMAIL,
            });
        } else if (e?.message?.includes('auth/email-already-in-use')) {
            res.push({
                message: ERROR_MESSAGE.EMAIL_ALREADY_IN_USE,
                field: ERROR_FIELD.EMAIL,
            });
        } else if (e?.message?.includes('[auth/invalid-credential] The supplied auth credential is malformed or has expired.')) {
            res.push({
                message: ERROR_MESSAGE.WRONG_EMAIL_OR_PASSWORD,
                field: ERROR_FIELD.EMAIL,
            });
        }

        return res;
    }

    get isFieldError() {
        return this.fields.length > 0;
    }
}
