import { types, IModelType } from 'mobx-state-tree';

type ID = string;

export function createCollection<T>(name: string, Model: IModelType<any, any>) {
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
        set(id: ID, value: T) {
          self._collection.set(id, value);
        },
        delete(id: ID) {
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
