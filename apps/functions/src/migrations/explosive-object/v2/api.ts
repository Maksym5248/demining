import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {
    TABLES,
    TABLES_DIR,
    type IExplosiveObjectDBv2,
    type IExplosiveObjectActionDBv2,
} from 'shared-my/db';

import { v2Tov3, actionV2Tov3 } from './entitie';

initializeApp({
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    credential: credential.cert(require('../../../../adminsdk.json')),
});

const collection = (table: string) => getFirestore().collection(table);

async function migrateExplosiveObjects() {
    const explosiveObjectsRef = collection(TABLES.EXPLOSIVE_OBJECT);
    const snapshot = await explosiveObjectsRef.get();

    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    const batch = getFirestore().batch();

    snapshot.forEach((doc) => {
        const data = doc.data() as IExplosiveObjectDBv2;
        const newData = v2Tov3(data);
        const docRef = explosiveObjectsRef.doc(doc.id);
        batch.set(docRef, newData);
    });

    await batch.commit();
    console.log('Migration completed for ExplosiveObjects.');
}

async function migrateExplosiveObjectActions() {
    const organizationDataRef = collection(TABLES.ORGANIZATION);
    const snapshot = await organizationDataRef.get();

    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    snapshot.forEach(async (doc) => {
        console.log('doc: ', doc.id);

        const explosiveObjectActionRef = collection(
            `${TABLES_DIR.ORGANIZATION_DATA}/${doc.id}/${TABLES.EXPLOSIVE_OBJECT_ACTION}`,
        );

        const snapshot = await explosiveObjectActionRef.get();

        const batch = getFirestore().batch();

        snapshot.forEach((doc) => {
            const data = doc.data() as IExplosiveObjectActionDBv2;
            const newData = actionV2Tov3(data);
            const docRef = explosiveObjectActionRef.doc(doc.id);
            batch.set(docRef, newData);
        });

        await batch.commit();
    });
    console.log('Migration completed for ExplosiveObjectActions.');
}

// Run migrations
migrateExplosiveObjects()
    .then(() => migrateExplosiveObjectActions())
    .catch((err) => console.error(err));