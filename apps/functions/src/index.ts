/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import { initializeApp } from 'firebase-admin/app';

initializeApp({
    storageBucket: process.env.STORAGE_BUCKET,
});

import {
    onMemberUpdate,
    onUserAccessUpdate,
    onUserCreate,
    translateOnWrite,
    onUserDelete,
    onCommentReplyWrite,
    parseBook,
} from './api';

export {
    onMemberUpdate,
    onUserAccessUpdate,
    onUserCreate,
    translateOnWrite,
    onUserDelete,
    onCommentReplyWrite,
    parseBook,
};
