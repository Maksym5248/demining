import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import { TABLES } from 'shared-my';

const db = getFirestore();

const createUserInfoRef = (uid: string) => db.collection(TABLES.COMMENT).doc(uid);

export const onCommentReplyWrite = functions
    .region(process.env.REGION ?? 'europe-central2')
    .firestore.document(`${TABLES.COMMENT}/{commentId}`)
    .onWrite(change => {
        const newValue = change.after.exists ? change.after.data() : null;
        const oldValue = change.before.exists ? change.before.data() : null;

        const batch = admin.firestore().batch();

        if (!newValue && oldValue?.parentId) {
            // Deleted a reply
            const parentRef = createUserInfoRef(oldValue.parentId);
            batch.update(parentRef, { replyCount: admin.firestore.FieldValue.increment(-1) });
        } else if (newValue?.parentId && !oldValue) {
            // Created a reply
            const parentRef = createUserInfoRef(newValue.parentId);
            batch.update(parentRef, { replyCount: admin.firestore.FieldValue.increment(1) });
        }

        return batch.commit();
    });
