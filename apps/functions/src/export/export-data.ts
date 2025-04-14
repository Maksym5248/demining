import * as fs from 'fs';

import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    credential: credential.cert(require('../../firebase-adminsdk.json')),
});

async function exportCollection(collectionName: string) {
    try {
        console.log(`Exporting collection: ${collectionName}`);
        const snapshot = await getFirestore().collection(collectionName).get();
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        fs.writeFileSync(`${collectionName}.json`, JSON.stringify(docs, null, 2));
    } catch (error) {
        console.error(`Error exporting collection ${collectionName}:`, error);
    }
}

const collections = [
    'EXPLOSIVE',
    'EXPLOSIVE_OBJECT_TYPE',
    'EXPLOSIVE_OBJECT_CLASS',
    'EXPLOSIVE_OBJECT_CLASS_ITEM',
    'EXPLOSIVE_OBJECT',
    'EXPLOSIVE_OBJECT_DETAILS',
];

collections.forEach(name => exportCollection(name));
