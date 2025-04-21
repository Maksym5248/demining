import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { TABLES, TABLES_DIR } from 'shared-my';

export enum TABLES_V1 {
    EXPLOSIVE_OBJECT_TYPE = 'EXPLOSIVE_OBJECT_TYPE',
    EXPLOSIVE_OBJECT_CLASS = 'EXPLOSIVE_OBJECT_CLASS',
    EXPLOSIVE_OBJECT_CLASS_ITEM = 'EXPLOSIVE_OBJECT_CLASS_ITEM',
    EXPLOSIVE_OBJECT = 'EXPLOSIVE_OBJECT',
    EXPLOSIVE_OBJECT_DETAILS = 'EXPLOSIVE_OBJECT_DETAILS',
    EXPLOSIVE = 'EXPLOSIVE_NEW',
    EXPLOSIVE_DEVICE = 'EXPLOSIVE',
}

initializeApp({
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    credential: credential.cert(require('../../../../firebase-adminsdk.json')),
});

const collection = (table: string) => getFirestore().collection(table);

async function migrate() {
    const explosiveTypeRefv1 = collection(TABLES_V1.EXPLOSIVE_OBJECT_TYPE);
    const explosiveClassRefv1 = collection(TABLES_V1.EXPLOSIVE_OBJECT_CLASS);
    const explosiveClassItemRefv1 = collection(TABLES_V1.EXPLOSIVE_OBJECT_CLASS_ITEM);
    const explosiveObjectsRefv1 = collection(TABLES_V1.EXPLOSIVE_OBJECT);
    const explosiveObjectsDetailsRefv1 = collection(TABLES_V1.EXPLOSIVE_OBJECT_DETAILS);
    const explosiveRefv1 = collection(TABLES_V1.EXPLOSIVE);
    const explosiveDeviceRefv1 = collection(TABLES_V1.EXPLOSIVE_DEVICE);

    const suffix = `/${TABLES_DIR.LANG}/uk`;

    const explosiveTypeRef = collection(TABLES.EXPLOSIVE_OBJECT_TYPE + suffix);
    const explosiveClassRef = collection(TABLES.EXPLOSIVE_OBJECT_CLASS + suffix);
    const explosiveClassItemRef = collection(TABLES.EXPLOSIVE_OBJECT_CLASS_ITEM + suffix);
    const explosiveObjectsRef = collection(TABLES.EXPLOSIVE_OBJECT + suffix);
    const explosiveObjectsDetailsRef = collection(TABLES.EXPLOSIVE_OBJECT_DETAILS + suffix);
    const explosiveRef = collection(TABLES.EXPLOSIVE + suffix);
    const explosiveDeviceRef = collection(TABLES.EXPLOSIVE_DEVICE + suffix);

    const v1 = [
        explosiveTypeRefv1,
        explosiveClassRefv1,
        explosiveClassItemRefv1,
        explosiveObjectsRefv1,
        explosiveObjectsDetailsRefv1,
        explosiveRefv1,
        explosiveDeviceRefv1,
    ];

    const v2 = [
        explosiveTypeRef,
        explosiveClassRef,
        explosiveClassItemRef,
        explosiveObjectsRef,
        explosiveObjectsDetailsRef,
        explosiveRef,
        explosiveDeviceRef,
    ];

    v1.forEach(async (snap, index) => {
        const snapshot = await snap.get();
        const ref = v2[index];

        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        const batch = getFirestore().batch();

        snapshot.forEach(doc => {
            const data = doc.data();
            const docRef = ref.doc(doc.id);
            batch.set(docRef, data);
        });

        await batch.commit();
    });

    console.log('Migration completed for ExplosiveObjects.');
}

// Run migrations
migrate().catch(err => console.error(err));
