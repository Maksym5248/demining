import { User } from 'firebase/auth';

import { ROLES } from '~/constants';

import { ICurrentUser } from './current-user';

export const createCurrentUser = (user: User): ICurrentUser => ({
	id: user.uid,
	name: String(user.displayName) || '',
	role: ROLES.USER,
	isAnonymous: user.isAnonymous ?? true
});
