declare module 'react-native-config' {
    export interface NativeConfig {
        ENV?: string;
        SENTRY_DSN?: string;
    }

    export const Config: NativeConfig;
    // eslint-disable-next-line import/no-default-export
    export default Config;
}
