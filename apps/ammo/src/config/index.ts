import Config from 'react-native-config';

export const CONFIG = {
    IS_DEBUG: !!__DEV__,
    ENV: Config.ENV ?? 'UNKNOWN',
    SENTRY_DSN: Config.SENTRY_DSN,
};
