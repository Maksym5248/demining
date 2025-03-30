import { type IListModel, type ICollectionModel, type IRequestModel, type IDataModel, type IData } from '~/models';

export interface IUseSelectStore<T extends IDataModel<B>, B extends IData> {
    fetchList: IRequestModel<any[]>;
    fetchMoreList?: IRequestModel<any[]>;
    fetchItem: IRequestModel<any[]>;
    collection: ICollectionModel<T, B>;
    list: IListModel<T, B>;
}
