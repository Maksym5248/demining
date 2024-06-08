import { SecureStorage, Storage } from '~/services';

export interface IEnv {
    Storage: typeof Storage;
    SecureStorage: typeof SecureStorage;
}

export const env = {
    Storage,
    SecureStorage,
};
