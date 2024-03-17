import { types, IModelType, IReferenceType } from 'mobx-state-tree';

interface IListOptions {
  pageSize: number;
}

export function createList<T>(
	name: string,
	Model: IModelType<any, any> | IReferenceType<IModelType<any, any>>,
	options: IListOptions,
) {
	const { pageSize } = options;

	return types.optional(
		types
			.model(name, {
				_array: types.optional(types.array(Model), []),
				_map: types.optional(types.map(types.boolean), {}),
				_isMorePages: true,
				pages: 0,
				pageSize,
			})

			.views((self) => ({
				get asArray(): T[] {
					return self._array.slice();
				},

				get first() {
					return self._array[0];
				},

				get last() {
					return self._array[self._array.length - 1];
				},

				get length() {
					return self._array.length;
				},
        
				get isEmpty() {
					return !!self._array.length;
				},

				includes(id:string){
					return !!self._map.get(id);
				}
			}))
			.views((self) => ({
				get isMorePages() {
					return self._isMorePages;
				},
			}))
			.views((self) => ({
				byIndex(index: number) {
					return self._array[index];
				},

				includes(id:string){
					return !!self._map.get(id);
				},

				findIndex(id: string) {
					return self._array.findIndex((i) => i === id);
				},
			}))

			.actions((self) => ({
				checkMore(length: number) {
					if(length < self.pageSize){
						self._isMorePages = false;

					} else {
						self._isMorePages = true;
					}
				},
				push(...ids: string[]) {
					ids.forEach(id => {
						self._map.set(id, true)
					})
					self._array.push(...ids);
				},

				unshift(...ids: string[]) {
					ids.forEach(id => {
						self._map.delete(id)
					})

					self._array.unshift(...ids);
				},

				replace(index: number, id: string) {
					const value = self._array[index];
					self._map.delete(value.id);
					self._map.set(id, true)
					self._array[index] = id;
				},

				remove(index: number) {
					const value = self._array[index];
					self._map.delete(value.id);

					self._array.splice(index, 1);
				},

				removeById(id: string) {
					self._map.delete(id);
					const index = self._array.findIndex(item => id === item.id);
					self._array.splice(index, 1);
				},

				clear() {
					self._map.clear();
					self._array.clear();
				},
			})),
		{},
	);
}
