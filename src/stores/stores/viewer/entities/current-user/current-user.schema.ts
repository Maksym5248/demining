import { ROLES } from '~/constants';

import { ICurrentUser } from './current-user';

export const createCurrentUser = (user: ICurrentUser): ICurrentUser => ({
  id: user.id,
  name: String(user.name) || '',
  role: user.role || ROLES.USER,
});
