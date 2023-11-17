import { Connection, ISelectQuery } from 'jsstore';
import uuid from 'uuid/v4';
import _ from 'lodash';

import { Overwrite } from '~/types'

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

    select(args?: Partial<Omit<ISelectQuery, 'from'>> ): Promise<T[]> {
        const params:ISelectQuery = {
            from: this.tableName,
            ...args
        };

        return this.db.select<T>(params);
    }

    async get(id:string):Promise<T> {
        const [res] = await this.db.select<T>({
            from: this.tableName,
            where: {
                id: id
            }
        });

        if(!res){
            throw new Error("there is no element by id")
        }

        return res
    }

    async exist(field:string, value: any):Promise<boolean> {
        const [res] = await this.db.select({
            from: this.tableName,
            where: {
                [field]: value
            },
            limit: 1
        });

        return !!res
    }

    async add(value: Omit<T, "createdAt" | "updatedAt" | "id">): Promise<T | null>{
        const id = await this.uuid();

        const res = await this.db.insert<T>({
            into: this.tableName,
            values: [Object.assign({}, value, {
                id,
                createdAt: new Date(),
                updatedAt: new Date(),
            })],
            return: true
        });

        return _.isArray(res) ? res[0]: null;
    }

    async update(id:string, value: Partial<Omit<T, "createdAt" | "updatedAt" | "id">>): Promise<T> {
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