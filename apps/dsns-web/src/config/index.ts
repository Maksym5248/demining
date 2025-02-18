export const CONFIG = {
    IS_DEV: process.env.ENV === 'dev',
    IS_DEBUG: process.env.NODE_ENV === 'development',
    DB_NAME: process.env.DB_NAME as string,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY as string,
    SENTRY: process.env.SENTRY as string,
    APP_NAME: 'dsns',
    APP_NAME_TRANSLATION: 'Demining',
    GEO_APIFY_KEY: process.env.GEO_APIFY_KEY as string,
};

export const FIREBASE_CONFIG = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_OMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKECT,
    messagingSenderId: process.env.FIREBASE_MESSANGIING_SENEDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASURMENT_ID,
};
