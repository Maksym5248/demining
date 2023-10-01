import { Connection, ISelectQuery } from 'jsstore';
import uuid from 'uuid/v4';

export class DBBase<T> {
    db: Connection;
    tableName: string;

    constructor(db: Connection, tableName: string){
        this.db = db;
        this.tableName = tableName;
    }

    async uuid(){
        let id = null;

        while(!id) {
            const testId = `${this.tableName}-${uuid()}`;
            
            const res = await this.db.select({
                from: this.tableName,
                where: {
                    id: testId
                }
            });

            if(!res.length){
                id = testId
            }
        }

        return id;

    }

    getList(args?: Partial<Omit<ISelectQuery, 'from'>> ) {
        const params:ISelectQuery = {
            from: this.tableName,
            ...args
        };

        return this.db.select(params);
    }

    async get(id:string) {
        const [res] = await this.db.select({
            from: this.tableName,
            where: {
                id: id
            }
        });

        return res
    }

    async add(value: object): Promise<T>{
        const id = await this.uuid();

        const [res] = await this.db.insert({
            into: this.tableName,
            values: [Object.assign({}, value, {
                id,
                createdAt: new Date(),
                updatedAt: new Date(),
            })],
            return: true
        });

        return res;
    }

    async update(id:string, value: object) {
        const newValue = Object.assign({}, value, {
            updatedAt: new Date(),
        });

        await this.db.update({ in: this.tableName,
            set: newValue,
            where: {
                id: id
            },
        });

        const res = await this.get(id);

        return res;
    }

    remove(id:string) {
        return this.db.remove({
            from: this.tableName,
            where: {
                id: id
            }
        })
    }
}