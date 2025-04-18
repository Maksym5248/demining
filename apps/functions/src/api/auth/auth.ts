import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { auth, https } from 'firebase-functions';
import * as logger from 'firebase-functions/logger';
import { type IMemberDB, type IUserAccessDB, type IUserInfoDB, ROLES, TABLES } from 'shared-my';

const createUserInfoRef = (uid: string) => getFirestore().collection(TABLES.USER_INFO).doc(uid);
const createUserAccessRef = (uid: string) => getFirestore().collection(TABLES.USER_ACCESS).doc(uid);
const createMemberRef = (uid: string) => getFirestore().collection(TABLES.MEMBER).doc(uid);

const customUserClaims = async ({
    access,
    member,
}: {
    access: IUserAccessDB;
    member: IMemberDB | null;
}) => {
    try {
        const customClaims = {
            ROOT_ADMIN: !!access?.roles[ROLES.ROOT_ADMIN],
            ORGANIZATION_ADMIN: !!access?.roles[ROLES.ORGANIZATION_ADMIN],
            AMMO_CONTENT_ADMIN: !!access?.roles[ROLES.AMMO_CONTENT_ADMIN],
            AMMO_VIEWER: !!access?.roles[ROLES.AMMO_VIEWER],
            DEMINING_VIEWER: !!access?.roles[ROLES.DEMINING_VIEWER],
            organizationId: member?.organizationId ?? null,
        };

        await getAuth().setCustomUserClaims(access.id, customClaims);

        const message = `Successfully updated token for user: ${access.id}`;
        logger.info(message);
        return { message };
    } catch (error) {
        const errorMessage = `Error claim user: ${access.id}`;
        logger.error(errorMessage);
        return { message: errorMessage };
    }
};

export const processSignUp = auth.user().onCreate(async user => {
    if (!user.email) {
        logger.info('User email does not exist', user);
        return;
    }

    const userInfoRef = createUserInfoRef(user.uid);
    const userAccessRef = createUserAccessRef(user.uid);
    const memberRef = createMemberRef(user.uid);

    const res = await userInfoRef.get();

    if (res.exists) {
        logger.info('User already exist', user);
        return;
    }

    try {
        const common = {
            id: user.uid,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        };

        await Promise.all([
            userInfoRef.set({
                ...common,
                email: user.email,
            } as IUserInfoDB),
            userAccessRef.set({
                ...common,
                roles: {
                    [ROLES.AMMO_VIEWER]: true,
                },
            } as IUserAccessDB),
            memberRef.set({
                ...common,
                organizationId: null,
            } as IMemberDB),
        ]);
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

    const userAccessRef = createUserAccessRef(uid);
    const membersRef = createMemberRef(uid);

    const [userAccessRes, memberRes] = await Promise.all([userAccessRef.get(), membersRef.get()]);

    if (!userAccessRes.exists) {
        logger.info('User access not found', uid);
        return { message: 'User access not found' };
    }

    const access = userAccessRes.data() as IUserAccessDB;
    const member = memberRes.data() as IMemberDB;

    try {
        await customUserClaims({ access, member });
        return { success: true };
    } catch (e) {
        logger.error('Error updating custom claims:', e);
        return { message: 'Error updating custom claims' };
    }
});
