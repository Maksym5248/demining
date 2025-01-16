import { type IListModel, type ICollectionModel, type IRequestModel } from '~/models';

export interface IUseSelectStore<T extends { data: B }, B extends { id: string }> {
    fetchList: IRequestModel<any[]>;
    fetchMoreList?: IRequestModel<any[]>;
    fetchItem: IRequestModel<any[]>;
    collection: ICollectionModel<T, B>;
    list: IListModel<T, B>;
}
