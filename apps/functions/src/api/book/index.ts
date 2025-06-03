import * as fs from 'fs';
import * as path from 'path';

import { credential } from 'firebase-admin';
import * as admin from 'firebase-admin';
import { ASSET_TYPE, TABLES } from 'shared-my';

// @ts-ignore
import serviceAccount from '../../../firebase-adminsdk.json';
import { parsePDF } from '../../parser/pdfParser';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: credential.cert(serviceAccount as any),
        storageBucket: 'gs://dsns-dev-85963.appspot.com',
    });
}

const db = admin.firestore();
const storage = admin.storage();

export async function ensureBookAssetsParsed(bookId: string) {
    // 1. Check if BOOK_ASSETS doc exists
    const bookAssetsRef = db.collection(TABLES.BOOK_ASSETS).doc(bookId);
    const bookAssetsSnap = await bookAssetsRef.get();
    if (bookAssetsSnap.exists) {
        return bookAssetsSnap.data();
    }

    // 2. Download book PDF from storage
    const bookFilePath = `/tmp/${bookId}.pdf`;
    const bookStoragePath = `${ASSET_TYPE.BOOK}/${bookId}`;
    const file = storage.bucket().file(bookStoragePath);
    await file.download({ destination: bookFilePath });

    // 3. Parse PDF
    const imagesDir = `/tmp/${bookId}_images`;
    const fontsDir = `/tmp/${bookId}_fonts`;
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
    if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir);
    const parsed = await parsePDF(bookFilePath, imagesDir, fontsDir);

    // 4. Save images to storage
    const imageFiles = fs.readdirSync(imagesDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
    const imageUrls: string[] = [];
    for (const imgFile of imageFiles) {
        const localPath = path.join(imagesDir, imgFile);
        const storagePath = `${ASSET_TYPE.BOOK_ASSETS}/${bookId}/${imgFile}`;
        await storage.bucket().upload(localPath, { destination: storagePath });
        imageUrls.push(storagePath);
    }

    // 5. Save parsed JSON to Firestore
    const docData = {
        ...parsed,
        bookId,
        images: imageUrls,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await bookAssetsRef.set(docData);
    return docData;
}

ensureBookAssetsParsed('9efc8798-3202-4cb4-a47b-dacaa18cd3b4');
