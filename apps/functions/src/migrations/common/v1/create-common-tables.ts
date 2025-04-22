import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {
    bookTypes,
    countries,
    explosiveDeviceTypeData,
    explosiveObjectComponentData,
    explosiveObjectStatuses,
    materialsData,
    missionRequestType,
    ranksData,
    TABLES,
    TABLES_DIR,
} from 'shared-my';

initializeApp({
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    credential: credential.cert(require('../../../../firebase-adminsdk.json')),
});

const collection = (table: string) => getFirestore().collection(table);
const suffix = `/${TABLES_DIR.LANG}/uk`;

async function migrateExplosiveObjects() {
    const bookTypesRef = collection(TABLES.BOOK_TYPE + suffix);
    const countryRef = collection(TABLES.COUNTRY + suffix);
    const explosiveDeviceTypesRef = collection(TABLES.EXPLOSIVE_DEVICE_OBJECT_TYPE + suffix);
    const explosiveComponentsRef = collection(TABLES.EXPLOSIVE_OBJECT_COMPONENT + suffix);
    const materialRef = collection(TABLES.MATERIAL + suffix);
    const missionRequestTypeRef = collection(TABLES.MISSION_REQUEST_TYPE + suffix);
    const ranksRef = collection(TABLES.RANKS + suffix);
    const statusesRef = collection(TABLES.STATUSES + suffix);

    const data = [
        {
            ref: bookTypesRef,
            data: bookTypes,
        },
        {
            ref: countryRef,
            data: countries,
        },
        {
            ref: explosiveDeviceTypesRef,
            data: explosiveDeviceTypeData,
        },
        {
            ref: explosiveComponentsRef,
            data: explosiveObjectComponentData,
        },
        {
            ref: materialRef,
            data: materialsData,
        },
        {
            ref: missionRequestTypeRef,
            data: missionRequestType,
        },
        {
            ref: ranksRef,
            data: ranksData,
        },
        {
            ref: statusesRef,
            data: explosiveObjectStatuses,
        },
    ];

    data.forEach(async ({ ref, data }) => {
        const batch = getFirestore().batch();

        data.forEach(async item => {
            const doc = ref.doc(item.id);
            batch.set(doc, item);
        });

        await batch.commit();
    });

    console.log('Creating of tables completed');
}

// Run migrations
migrateExplosiveObjects().catch(err => console.error(err));
