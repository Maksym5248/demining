import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
// Import firestore from firebase-functions
import { auth, firestore, https } from 'firebase-functions';
import * as logger from 'firebase-functions/logger';
import {
    type IMemberDB,
    type IUserAccessDB,
    type IUserInfoDB,
    ROLES,
    TABLES,
    type Timestamp,
} from 'shared-my';

const db = getFirestore();

const createUserInfoRef = (uid: string) => db.collection(TABLES.USER_INFO).doc(uid);
const createUserAccessRef = (uid: string) => db.collection(TABLES.USER_ACCESS).doc(uid);
const createMemberRef = (uid: string) => db.collection(TABLES.MEMBER).doc(uid);

const customUserClaims = async ({
    uid,
    access,
    member,
}: {
    uid: string; // Pass uid explicitly
    access: IUserAccessDB | null; // Allow null if document might not exist
    member: IMemberDB | null; // Allow null if document might not exist
}) => {
    // Ensure we have at least access data to proceed, or clear claims if desired
    if (!access) {
        logger.warn(`User access data not found for uid: ${uid}, cannot set claims.`);
        // Optionally clear claims if access is removed:
        // await getAuth().setCustomUserClaims(uid, {});
        // return { message: `User access data not found for uid: ${uid}, claims cleared.` };
        return { message: `User access data not found for uid: ${uid}` };
    }

    try {
        const customClaims = {
            ROOT_ADMIN: !!access[ROLES.ROOT_ADMIN],
            ORGANIZATION_ADMIN: !!access[ROLES.ORGANIZATION_ADMIN],
            AMMO_CONTENT_ADMIN: !!access[ROLES.AMMO_CONTENT_ADMIN],
            AMMO_VIEWER: !!access[ROLES.AMMO_VIEWER],
            DEMINING_VIEWER: !!access[ROLES.DEMINING_VIEWER],
            organizationId: member?.organizationId ?? null,
        };

        await getAuth().setCustomUserClaims(uid, customClaims); // Use the passed uid

        const message = `Successfully updated token claims for user: ${uid}`;
        logger.info(message, { uid, claims: customClaims });
        return { message };
    } catch (error) {
        const errorMessage = `Error setting custom claims for user: ${uid}`;
        logger.error(errorMessage, { uid, error });
        // Re-throw or return error indication if needed downstream
        throw new https.HttpsError('internal', errorMessage);
    }
};

export const onUserCreate = auth.user().onCreate(async user => {
    if (!user.email) {
        logger.info('User email does not exist, cannot process signup fully.', { uid: user.uid });
        // Consider if you still want to create partial records or just exit
        return;
    }

    const userInfoRef = createUserInfoRef(user.uid);
    const userAccessRef = createUserAccessRef(user.uid);
    const memberRef = createMemberRef(user.uid);

    const res = await userInfoRef.get();

    if (res.exists) {
        logger.info('User info document already exists, skipping creation.', { uid: user.uid });
        // Optionally check/update claims here if needed for existing users during re-auth?
        return;
    }

    const common = {
        id: user.uid,
        createdAt: FieldValue.serverTimestamp() as Timestamp,
        updatedAt: FieldValue.serverTimestamp() as Timestamp,
    };

    const initialAccess: IUserAccessDB = {
        ...common,
        [ROLES.AMMO_VIEWER]: true,
    };
    const initialMember: IMemberDB = {
        ...common,
        organizationId: null,
    };
    const initialUserInfo: IUserInfoDB = {
        ...common,
        email: user.email,
        photoUri: user.photoURL ?? null,
        name: user.displayName ?? null,
    };

    try {
        await Promise.all([
            userInfoRef.set(initialUserInfo),
            userAccessRef.set(initialAccess),
            memberRef.set(initialMember),
        ]);

        logger.info(`Successfully created initial documents for user: ${user.uid}`);

        await customUserClaims({ uid: user.uid, access: initialAccess, member: initialMember });

        logger.info(`Successfully set initial claims for user: ${user.uid}`);

        return { message: `Successfully created user and set initial claims: ${user.uid}` };
    } catch (error) {
        const errorMessage = `Error during signup process for user: ${user.uid}`;
        logger.error(errorMessage, { error });
        // Consider more specific error handling or cleanup if needed
        return { message: errorMessage };
    }
});

export const onUserDelete = auth.user().onDelete(async user => {
    const userInfoRef = createUserInfoRef(user.uid);
    const userAccessRef = createUserAccessRef(user.uid);
    const memberRef = createMemberRef(user.uid);

    try {
        await Promise.all([userInfoRef.delete(), userAccessRef.delete(), memberRef.delete()]);

        logger.info(`Successfully deteted initial documents for user: ${user.uid}`);

        return { message: `Successfully deteted user: ${user.uid}` };
    } catch (error) {
        const errorMessage = `Error during deteting process for user: ${user.uid}`;
        logger.error(errorMessage, { error });
        // Consider more specific error handling or cleanup if needed
        return { message: errorMessage };
    }
});

export const onUserAccessUpdate = firestore
    .document(`${TABLES.USER_ACCESS}/{uid}`)
    .onUpdate(async (change, context) => {
        const uid = context.params.uid;
        const accessBefore = change.before.data() as IUserAccessDB | undefined;
        const accessAfter = change.after.data() as IUserAccessDB | undefined;

        // Check if relevant role fields actually changed
        const rolesChanged = Object.values(ROLES).some(
            role => accessBefore?.[role] !== accessAfter?.[role],
        );

        if (!rolesChanged) {
            logger.debug(`No relevant roles changed for user: ${uid}. Skipping claim update.`);
            return null; // Exit if no relevant change
        }

        logger.info(`User access roles changed for uid: ${uid}. Updating claims.`);

        const memberRef = createMemberRef(uid);
        const memberSnap = await memberRef.get();
        const member = memberSnap.exists ? (memberSnap.data() as IMemberDB) : null;

        try {
            await customUserClaims({ uid, access: accessAfter ?? null, member });
            return { success: true };
        } catch (error) {
            logger.error(`Failed to update claims after access change for uid: ${uid}`, { error });
            return { success: false, error: (error as Error).message };
        }
    });

export const onMemberUpdate = firestore
    .document(`${TABLES.MEMBER}/{uid}`)
    .onUpdate(async (change, context) => {
        const uid = context.params.uid;
        const memberBefore = change.before.data() as IMemberDB | undefined;
        const memberAfter = change.after.data() as IMemberDB | undefined;

        if (memberBefore?.organizationId === memberAfter?.organizationId) {
            logger.debug(`Organization ID did not change for user: ${uid}. Skipping claim update.`);
            return null;
        }

        logger.info(`Member organization changed for uid: ${uid}. Updating claims.`);

        const userAccessRef = createUserAccessRef(uid);
        const userAccessSnap = await userAccessRef.get();
        const access = userAccessSnap.exists ? (userAccessSnap.data() as IUserAccessDB) : null;

        try {
            await customUserClaims({ uid, access, member: memberAfter ?? null });
            return { success: true };
        } catch (error) {
            logger.error(`Failed to update claims after member change for uid: ${uid}`, { error });
            return { success: false, error: (error as Error).message };
        }
    });

/**
 * @deprecated
 */
export const refreshToken = https.onCall(async (data, context) => {
    const uid = context?.auth?.uid;

    if (!uid) {
        logger.warn('refreshToken called without authenticated user.');
        throw new https.HttpsError('unauthenticated', 'User is not authenticated.');
    }

    logger.info(`Manual refresh token requested for uid: ${uid}`);

    const userAccessRef = createUserAccessRef(uid);
    const membersRef = createMemberRef(uid);

    try {
        const [userAccessSnap, memberSnap] = await Promise.all([
            userAccessRef.get(),
            membersRef.get(),
        ]);

        const access = userAccessSnap.exists ? (userAccessSnap.data() as IUserAccessDB) : null;
        const member = memberSnap.exists ? (memberSnap.data() as IMemberDB) : null;

        // Call the helper function to ensure claims are up-to-date
        await customUserClaims({ uid, access, member });
        return { success: true };
    } catch (error) {
        logger.error(`Error during manual refresh token for uid: ${uid}`, { error });
        if (error instanceof https.HttpsError) {
            throw error; // Re-throw HttpsError from customUserClaims
        }
        throw new https.HttpsError('internal', 'Failed to refresh token claims.');
    }
});
