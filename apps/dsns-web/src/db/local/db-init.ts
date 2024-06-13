import { Connection, IDataBase } from 'jsstore';

// This will ensure that we are using only one instance.
// Otherwise due to multiple instance multiple worker will be created.

class DBInitClass {
    db: Connection;

    constructor(workerPath: string) {
        this.db = new Connection(new Worker(workerPath));
    }

    init = async (dataBaseSchema: IDataBase) => {
        try {
            await this.db.initDb(dataBaseSchema);
        } catch (ex) {
            console.error(ex);
        }
    };

    dropDb = () => this.db.dropDb();

    removeAllDbs = () => {
        window.indexedDB
            .databases()
            .then((r) => {
                for (let i = 0; i < r.length; i += 1) window.indexedDB.deleteDatabase(r[i].name as string);
            })
            .then(() => {
                alert('All data cleared.');
            });
    };

    getDB() {
        return this.db;
    }
}

const getWorkerPath = () => {
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line
        return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.js");
    }
    // eslint-disable-next-line
        return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js");
};

export const DBInit = new DBInitClass(getWorkerPath().default);
