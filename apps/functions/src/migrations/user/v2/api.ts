import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { TABLES } from 'shared-my';

import { type IUserAccessV1, v2Tov3 } from './entitie';

initializeApp({
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    credential: credential.cert(require('../../../../firebase-adminsdk.json')),
});

const collection = (table: string) => getFirestore().collection(table);

async function migrateExplosiveObjects() {
    const userAccessRef = collection(TABLES.USER_ACCESS);

    const snapshot = await userAccessRef.get();

    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    const batch = getFirestore().batch();

    snapshot.forEach(doc => {
        const data = doc.data() as IUserAccessV1;
        const newData = v2Tov3(data);
        const userAccessDocRef = userAccessRef.doc(doc.id);

        batch.set(userAccessDocRef, newData.access);
    });

    await batch.commit();
    console.log('Migration completed for ExplosiveObjects.');
}

// Run migrations
migrateExplosiveObjects().catch(err => console.error(err));
