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
}

export class ErrorModel implements IErrorModel {
    data: Error;

    message: ERROR_MESSAGE;
    status: number | null;
    fields: IErrorField[] = [];

    constructor(e: Error) {
        console.log('e', e?.message);
        if (e instanceof ErrorModel) {
            this.data = e.data;
            this.message = e.message;
            this.status = e.status;
            this.fields = e.fields;
        } else {
            this.data = e;
            this.message = this.getMessage();
            this.status = this.getStatus(e);
            this.fields = this.getFields(e);
        }
    }

    private getMessage() {
        return ERROR_MESSAGE.UNEXPECTED;
    }

    private getStatus(e: Error) {
        return get(e, 'response.status', null);
    }

    private getFields(e: Error) {
        const res = [];

        if (e?.message?.includes('auth/invalid-login-credentials')) {
            res.push({
                message: ERROR_MESSAGE.WRONG_EMAIL_OR_PASSWORD,
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
}
