import { get } from 'lodash';

const getMessage = (e: Error) =>
  get(e, 'response.data.message') || get(e, 'message') || 'errors.unexpected_error';

export const error = {
  getMessage,
};
