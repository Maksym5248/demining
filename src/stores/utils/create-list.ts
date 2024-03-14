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
			}))
			.views((self) => ({
				get startAt(){
					return self.length
				}
			}))
			.views((self) => ({
				get isMorePages() {
					return !((self.length / self.pageSize) % 0 && self.pages !== undefined);
				},
			}))
			.views((self) => ({
				byIndex(index: number) {
					return self._array[index];
				},

				includes(id: string) {
					return self._array.includes(id);
				},

				findIndex(id: string) {
					return self._array.findIndex((i) => i === id);
				},
			}))

			.actions((self) => ({
				push(...ids: string[]) {
					self._array.push(...ids);
				},

				unshift(...ids: string[]) {
					self._array.unshift(...ids);
				},

				replace(index: number, id: string) {
					self._array[index] = id;
				},

				remove(index: number) {
					self._array.splice(index, 1);
				},

				removeById(id: string) {
					const index = self._array.findIndex(item => id === item.id);
					self._array.splice(index, 1);
				},

				clear() {
					self._array.clear();
				},
			})),
		{},
	);
}
