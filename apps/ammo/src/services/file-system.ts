import { Dirs, FileSystem } from 'react-native-file-access';
import { type ProgressListener } from 'react-native-file-access/lib/typescript/types';
import { Logger } from 'shared-my-client';

export interface IFileSystem {
    exists(filePath: string): Promise<boolean>;
    existsMany(filePaths: string[]): Promise<boolean[]>;
    download(fromUrl: string, onProgress?: ProgressListener): Promise<void>;
    preload(uris: string[]): Promise<void>;
    getPath(uri: string): string;
    getLocalPath(uri: string): string;
}

export class FileSystemClass {
    constructor(
        private dir: string,
        private fileFormat?: string,
        private table?: string,
    ) {}

    async init(): Promise<void> {
        const dirPath = `${Dirs.CacheDir}/${this.dir}`;
        const dirExists = await FileSystem.exists(dirPath);
        Logger.log(`FileSystem dir (${this.dir}) init: `, dirExists);

        if (!dirExists) {
            await FileSystem.mkdir(dirPath);
        }
    }

    async preload(uris: string[]): Promise<void> {
        const urls = await Promise.allSettled(
            uris.map(async uri => {
                try {
                    const fileExists = await this.exists(uri);
                    return fileExists ? null : uri;
                } catch (error) {
                    return null;
                }
            }),
        );

        Logger.log(`FileSystem dir (${this.dir}): `, urls.length);

        const unsevedUrls = urls
            .filter((result): result is PromiseFulfilledResult<string | null> => result.status === 'fulfilled' && !!result.value)
            .map(result => result.value as string);

        Logger.log(`FileSystem dir(${this.dir}) - loading unsaved: `, unsevedUrls.length);

        await Promise.allSettled(unsevedUrls.map(uri => this.download(uri)));
    }

    async exists(uri: string): Promise<boolean> {
        const path = this.getPath(uri);
        try {
            const res = await FileSystem.exists(path);
            return res;
        } catch (error) {
            Logger.error('Images - failed to check if file exists:', error);
            return false;
        }
    }

    async existsMany(uris: string[]): Promise<boolean[]> {
        return Promise.all(uris.map(uri => this.exists(uri)));
    }

    async download(url: string, onProgress?: ProgressListener): Promise<void> {
        try {
            await FileSystem.fetch(
                url,
                {
                    method: 'GET',
                    path: this.getPath(url),
                },
                onProgress,
            );
        } catch (error) {
            console.error('Failed to download file:', error);
        }
    }

    private getFileName(uri: string) {
        const value = uri.split('/').pop();
        const name = value?.split('?')[0];
        return this.table ? name?.replace(`${this.table}%`, '') : name;
    }

    getPath(uri: string): string {
        const fileName = this.getFileName(uri);
        const format = this.fileFormat ? `.${this.fileFormat}` : '';
        return `${Dirs.CacheDir}/${this.dir}/${fileName}${format}`;
    }

    getLocalPath(uri: string): string {
        return `file://${this.getPath(uri)}`;
    }
}
