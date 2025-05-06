import { ERROR_MESSAGE } from 'shared-my';

import { ErrorModel, type IForm } from '~/models';

import { type ILogger, type IMessage } from './types';

export interface IErrorManager {
    form<T>(form: IForm<T>, e: unknown): void;
    request(e: unknown): void;
}

export class ErrorManagerClass implements IErrorManager {
    constructor(
        private message: IMessage,
        private logger: ILogger,
    ) {}

    form<T = any>(form: IForm<T>, e: unknown) {
        const error = new ErrorModel(e);

        form.setErrors(error);

        if (!error.isFieldError && !!error.message) {
            this.message.error(error.message);
        }
    }

    request(e: unknown) {
        const error = new ErrorModel(e);

        if (error?.message === ERROR_MESSAGE.CANCELED || error?.message === ERROR_MESSAGE.PERMISSIONS_NOT_GRANTED) {
            return;
        }

        if (!error.message) {
            return;
        }

        this.message.error(error.message);
        this.logger.error((error.data as Error)?.message || error);
    }
}
