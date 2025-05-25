import { Logger } from 'shared-my-client';

export interface IDBConnection {
    init: () => Promise<void>;
    drop: () => void;
    closeDB: () => Promise<void>;
    connetion: IDBDatabase;
}

export class DBConnection implements IDBConnection {
    private dbConnection?: IDBDatabase;

    constructor(private dbName = 'Demining') {}
    version = 1;

    private async openDB(onUpgared?: (db: IDBDatabase) => void): Promise<IDBDatabase> {
        if (this.dbConnection) {
            return this.dbConnection; // Reuse existing connection
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = event => {
                // @ts-ignore
                const db = event.target?.result as unknown as IDBDatabase;
                onUpgared?.(db);
                this.dbConnection = request.result;
                Logger.log('[TEST] DBConnection onupgradeneeded');
            };

            request.onsuccess = () => {
                this.dbConnection = request.result;
                resolve(this.dbConnection);
                Logger.log('[TEST] DBConnection onsuccess');
            };

            request.onerror = () => reject(request.error);
        });
    }

    async init(onUpgared?: (db: IDBDatabase) => void): Promise<void> {
        await this.openDB(onUpgared);
    }

    drop(): void {
        if (this.dbConnection) {
            this.dbConnection.close();
            indexedDB.deleteDatabase(this.dbName);
            this.dbConnection = undefined; // Clear the cached connection
        }
    }

    async closeDB(): Promise<void> {
        if (this.dbConnection) {
            this.dbConnection.close();
            this.dbConnection = undefined; // Clear the cached connection
        }
    }

    get connetion(): IDBDatabase {
        return this.dbConnection as IDBDatabase;
    }
}
