import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { TABLES } from 'shared-my';

import { type IUserV1, v1Tov2 } from './entitie';

initializeApp({
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    credential: credential.cert(require('../../../../firebase-adminsdk.json')),
});

const collection = (table: string) => getFirestore().collection(table);

async function migrateExplosiveObjects() {
    const userRef = collection('USER');

    const userAccessRef = collection(TABLES.USER_ACCESS);
    const userInfoRef = collection(TABLES.USER_INFO);
    const memberRef = collection(TABLES.MEMBER);

    const snapshot = await userRef.get();

    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    const batch = getFirestore().batch();

    snapshot.forEach(doc => {
        const data = doc.data() as IUserV1;
        const newData = v1Tov2(data);
        const userAccessDocRef = userAccessRef.doc(doc.id);
        const userInfoDocRef = userInfoRef.doc(doc.id);
        const memberDocRef = memberRef.doc(doc.id);

        batch.set(userAccessDocRef, newData.access);
        batch.set(userInfoDocRef, newData.info);
        batch.set(memberDocRef, newData.member);
    });

    await batch.commit();
    console.log('Migration completed for ExplosiveObjects.');
}

// Run migrations
migrateExplosiveObjects().catch(err => console.error(err));
