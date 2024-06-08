import { types, IModelType } from 'mobx-state-tree';

import { ICollection } from '../types';

type ID = string;

export function createCollection<T, B>(name: string, Model: IModelType<any, any>) {
    return types.optional(
        types
            .model(name, {
                _collection: types.map(Model),
            })

            .views((self) => ({
                get(id: ID): T {
                    return self._collection.get(id);
                },
                has(id: ID): boolean {
                    return !!self._collection.has(id);
                },
            }))

            .actions((self) => ({
                set(id: ID, value: B) {
                    self._collection.set(id, value);
                },
                remove(id: ID) {
                    self._collection.delete(id);
                },
                update(id: ID, value: Partial<T>) {
                    const item = self._collection.get(id);

                    if (!item) {
                        throw Error('Element is not created');
                    }

                    Object.assign(item, value);
                },
                merge(values: { [id: string]: T }) {
                    self._collection.merge(values);
                },
                clear() {
                    self._collection.clear();
                },
            })),
        {},
    );
}
