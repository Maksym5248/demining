import { ROLES } from '~/constants';

import { ICurrentUser } from './current-user';

export const normalizeCurrentUser = (user: ICurrentUser): ICurrentUser => ({
  id: user.id,
  name: String(user.name) || '',
  role: user.role || ROLES.USER,
});
