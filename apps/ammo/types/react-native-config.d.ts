declare module 'react-native-config' {
    export interface NativeConfig {
        ENV?: string;
        SENTRY_DSN?: string;
        SUPPORT_EMAIL?: string;
        WEB_CLIENT_ID?: string;
        IOS_SCHEMA_GOOGLE?: string;
    }

    export const Config: NativeConfig;
    // eslint-disable-next-line import/no-default-export
    export default Config;
}
