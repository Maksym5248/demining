import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { TABLES } from 'shared-my';

import { type IExplosiveObjectDBPrev, v2Tov3 } from './entitie';

initializeApp({
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    credential: credential.cert(require('../../../../firebase-adminsdk.json')),
});

const collection = (table: string) => getFirestore().collection(table);

async function migrateExplosiveObjects() {
    const explosiveObjectsRef = collection(TABLES.EXPLOSIVE_OBJECT);
    const explosiveObjectsDetailsRef = collection(TABLES.EXPLOSIVE_OBJECT_DETAILS);

    const snapshot = await explosiveObjectsRef.get();

    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    const batch = getFirestore().batch();

    snapshot.forEach(doc => {
        const data = doc.data() as IExplosiveObjectDBPrev;
        const newData = v2Tov3(data);
        const docRef = explosiveObjectsRef.doc(doc.id);
        const docDetailsRef = explosiveObjectsDetailsRef.doc(doc.id);

        batch.set(docRef, newData.explosiveObject);
        batch.set(docDetailsRef, newData.explosiveObjectDetails);
    });

    await batch.commit();
    console.log('Migration completed for ExplosiveObjects.');
}

// Run migrations
migrateExplosiveObjects().catch(err => console.error(err));
