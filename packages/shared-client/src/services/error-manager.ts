import { ErrorModel, type IForm } from '~/models';

import { type IMessage } from './types';

export interface IErrorManager {
    form<T>(form: IForm<T>, e: unknown): void;
}

export class ErrorManagerClass implements IErrorManager {
    constructor(private message: IMessage) {}

    form<T = any>(form: IForm<T>, e: unknown) {
        const error = new ErrorModel(e);

        form.setErrors(error);

        if (!error.isFieldError && !!error.message) {
            this.message.error(error.message);
        }
    }
}
