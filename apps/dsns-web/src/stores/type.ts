import { type ICollectionModel, type IListModel, type IRequestModel } from '~/utils/models';

export interface IUseSelectStore<T extends B, B extends { id: string }> {
    fetchList: IRequestModel<[search: string]>;
    fetchMoreList: IRequestModel<[search: string]>;
    fetchItem: IRequestModel<[string]>;
    collection: ICollectionModel<T, B>;
    searchList: IListModel<T, B>;
    list: IListModel<T, B>;
}
