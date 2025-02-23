import { Dirs, FileSystem } from 'react-native-file-access';
import { type ProgressListener } from 'react-native-file-access/lib/typescript/types';

export interface IFileSystem {
    exists(filePath: string): Promise<boolean>;
    download(fromUrl: string, onProgress?: ProgressListener): Promise<void>;
    getPath(uri: string): string;
    getLocalPath(uri: string): string;
}

export class FileSystemClass {
    constructor(
        private dir: string,
        private fileFormat?: string,
    ) {}

    async init(): Promise<void> {
        const dirPath = `${Dirs.CacheDir}/${this.dir}`;
        const dirExists = await FileSystem.exists(dirPath);

        if (!dirExists) {
            await FileSystem.mkdir(dirPath);
        }
    }

    async exists(uri: string): Promise<boolean> {
        const path = this.getPath(uri);
        try {
            return await FileSystem.exists(path);
        } catch (error) {
            console.error('Failed to check if file exists:', error);
            return false;
        }
    }

    async download(url: string, onProgress?: ProgressListener): Promise<void> {
        try {
            await FileSystem.fetch(
                url,
                {
                    method: 'GET',
                    path: this.fileFormat ? `${this.getPath(url)}.${this.fileFormat}` : this.getPath(url),
                },
                onProgress,
            );
        } catch (error) {
            console.error('Failed to download file:', error);
        }
    }

    private getFileName(uri: string) {
        const value = uri.split('/').pop();
        return value?.split('?')[0];
    }

    getPath(uri: string): string {
        const fileName = this.getFileName(uri);
        return `${Dirs.CacheDir}/${this.dir}/${fileName}`;
    }

    getLocalPath(uri: string): string {
        return `file://${this.getPath(uri)}`;
    }
}
