import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { auth, https } from 'firebase-functions';
import * as logger from 'firebase-functions/logger';
import { type IUserDB, ROLES } from 'shared-my/db';

const createUserRef = (uid: string) => getFirestore().collection('USER').doc(uid);

const customUserClaims = async (userData: IUserDB) => {
    try {
        const customClaims = {
            ROOT_ADMIN: userData?.roles.includes(ROLES.ROOT_ADMIN),
            ORGANIZATION_ADMIN: userData?.roles.includes(ROLES.ORGANIZATION_ADMIN),
            AUTHOR: userData?.roles.includes(ROLES.AUTHOR),
            organizationId: userData?.organizationId,
        };

        await getAuth().setCustomUserClaims(userData.id, customClaims);

        const message = `Successfully updated token for user: ${userData.id}`;
        logger.info(message);
        return { message };
    } catch (error) {
        const errorMessage = `Error claim user: ${userData.id}`;
        logger.error(errorMessage);
        return { message: errorMessage };
    }
};

export const processSignUp = auth.user().onCreate(async (user) => {
    if (!user.email) {
        logger.info('User email does not exist', user);
        return;
    }

    const userRef = createUserRef(user.uid);
    const res = await userRef.get();

    if (res.exists) {
        logger.info('User already exist', user);
        return;
    }

    try {
        const userData = {
            id: user.uid,
            email: user.email,
            roles: [],
            organizationId: null,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        };

        await userRef.set(userData);
    } catch (error) {
        const errorMessage = `Error creating user: ${user.uid}`;
        logger.error(errorMessage);
        return { message: errorMessage };
    }

    const message = `Successfully created user: ${user.uid}`;
    logger.info(message);
    return { message };
});

export const refreshToken = https.onCall(async (data, context) => {
    const uid = context?.auth?.uid ?? '';

    if (!uid) {
        logger.info('uuid not defined');
        return { message: 'uuid not defined' };
    }

    const userRef = createUserRef(uid);
    const res = await userRef.get();
    const user = res.data() as IUserDB;

    try {
        await customUserClaims(user);
        return { success: true };
    } catch (e) {
        logger.error('Error updating custom claims:', e);
        return { message: 'Error updating custom claims' };
    }
});
