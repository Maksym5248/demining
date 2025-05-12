export interface IDBConnection {
    init: () => Promise<void>;
    drop: () => void;
    closeDB: () => Promise<void>;
    connetion: IDBDatabase;
}

export class DBConnection implements IDBConnection {
    private dbConnection?: IDBDatabase; // Store the database connection

    constructor(private dbName = 'Demining') {}

    private async openDB(): Promise<IDBDatabase> {
        if (this.dbConnection) {
            return this.dbConnection; // Reuse existing connection
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName);

            request.onupgradeneeded = () => {
                this.dbConnection = request.result;
                resolve(this.dbConnection);
            };

            request.onsuccess = () => {
                this.dbConnection = request.result; // Cache the connection
                resolve(this.dbConnection);
            };

            request.onerror = () => reject(request.error);
        });
    }

    async init(): Promise<void> {
        await this.openDB();
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
