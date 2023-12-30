import { get } from 'lodash';

const getMessage = (e: Error) =>
	get(e, 'response.data.message') || get(e, 'message') || 'errors.unexpected_error';

const createError =  (e:  Error) => ({
	message: getMessage(e),
	status: get(e, 'response.status', null),
	reason: get(e, 'response.data.reason', null),
});

export const error = {
	getMessage,
	createError,
};
