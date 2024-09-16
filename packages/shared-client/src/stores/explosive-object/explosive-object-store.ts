import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';
import { type EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { type IExplosiveObjectAPI, type IExplosiveObjectActionSumDTO, type IExplosiveObjectDTO } from '~/api';
import { data, type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, type ITreeModel, ListModel, RequestModel, TreeModel } from '~/models';
import { type IMessage } from '~/services';

import {
    ExplosiveObject,
    ExplosiveObjectType,
    createExplosiveObjectDTO,
    createExplosiveObjectActionSum,
    ExplosiveObjectAction,
    Country,
    ExplosiveObjectClass,
    ExplosiveObjectClassItem,
    type IExplosiveObject,
    type IExplosiveObjectType,
    type IExplosiveObjectData,
    type IExplosiveObjectTypeData,
    type IExplosiveObjectDataParams,
    type IExplosiveObjectActionData,
    type IExplosiveObjectAction,
    type ICountry,
    type ICountryData,
    type IExplosiveObjectClassData,
    type IExplosiveObjectClass,
    type IExplosiveObjectClassItemData,
    type IExplosiveObjectClassItem,
    createExplosiveObjectClassItem,
    createExplosiveObjectType,
    createExplosiveObjectClass,
    createCountry,
    type IExplosiveObjectGroup,
    type IExplosiveObjectGroupData,
    ExplosiveObjectGroup,
    createExplosiveObjectGroup,
    type IExplosiveObjectDetailsData,
    type IExplosiveObjectDetails,
    ExplosiveObjectDetails,
    createExplosiveObject,
    createExplosiveObjectDetails,
} from './entities';
import { SumExplosiveObjectActions } from './sum-explosive-object-actions';

interface IApi {
    explosiveObject: IExplosiveObjectAPI;
}

interface IServices {
    message: IMessage;
}

export interface IExplosiveObjectStore {
    collectionTypes: CollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    collectionActions: CollectionModel<IExplosiveObjectAction, IExplosiveObjectActionData>;
    collection: CollectionModel<IExplosiveObject, IExplosiveObjectData>;
    collectionGroups: CollectionModel<IExplosiveObjectGroup, IExplosiveObjectGroupData>;
    collectionCountries: CollectionModel<ICountry, ICountryData>;
    collectionClasses: CollectionModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
    collectionClassesItems: CollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    listTypes: ListModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    list: ListModel<IExplosiveObject, IExplosiveObjectData>;
    searchList: ListModel<IExplosiveObject, IExplosiveObjectData>;
    listGroups: ListModel<IExplosiveObjectGroup, IExplosiveObjectGroupData>;
    listCountries: ListModel<ICountry, ICountryData>;
    listClasses: ListModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
    listClassesItems: ListModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    sum: SumExplosiveObjectActions;
    sortedListTypes: IExplosiveObjectType[];
    setSum: (sum: IExplosiveObjectActionSumDTO) => void;
    append: (res: IExplosiveObjectDTO[], isSearch: boolean, isMore?: boolean) => void;
    getClassesByGroupId(groupId: string, component: EXPLOSIVE_OBJECT_COMPONENT): IExplosiveObjectClass[];
    treeClassesItems: ITreeModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    create: RequestModel<[ICreateValue<IExplosiveObjectDataParams>]>;
    remove: RequestModel<[string]>;
    fetchList: RequestModel<[search?: string]>;
    fetchSum: RequestModel<[Dayjs, Dayjs]>;
    fetchMoreList: RequestModel<[search?: string]>;
    fetchItem: RequestModel<[string]>;
    fetchDeeps: RequestModel;
}

export class ExplosiveObjectStore implements IExplosiveObjectStore {
    api: IApi;
    services: IServices;
    collectionGroups = new CollectionModel<IExplosiveObjectGroup, IExplosiveObjectGroupData>({
        factory: (data: IExplosiveObjectGroupData) => new ExplosiveObjectGroup(data),
    });

    collectionTypes = new CollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>({
        factory: (data: IExplosiveObjectTypeData) => new ExplosiveObjectType(data),
    });
    collectionCountries = new CollectionModel<ICountry, ICountryData>({
        factory: (data: ICountryData) => new Country(data),
    });
    collectionClasses = new CollectionModel<IExplosiveObjectClass, IExplosiveObjectClassData>({
        factory: (data: IExplosiveObjectClassData) =>
            new ExplosiveObjectClass(data, { collections: { classItem: this.collectionClassesItems }, lists: this.lists }),
    });
    collectionClassesItems = new CollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>({
        factory: (data: IExplosiveObjectClassItemData) => new ExplosiveObjectClassItem(data),
    });
    collectionActions = new CollectionModel<IExplosiveObjectAction, IExplosiveObjectActionData>({
        factory: (data: IExplosiveObjectActionData) => new ExplosiveObjectAction(data, this),
    });
    collectionDetails = new CollectionModel<IExplosiveObjectDetails, IExplosiveObjectDetailsData>({
        factory: (data: IExplosiveObjectDetailsData) => new ExplosiveObjectDetails(data),
    });
    collection = new CollectionModel<IExplosiveObject, IExplosiveObjectData>({
        factory: (data: IExplosiveObjectData) => new ExplosiveObject(data, this),
    });

    listGroups = new ListModel<IExplosiveObjectGroup, IExplosiveObjectGroupData>({
        collection: this.collectionGroups,
    });

    listCountries = new ListModel<ICountry, ICountryData>({
        collection: this.collectionCountries,
    });
    listTypes = new ListModel<IExplosiveObjectType, IExplosiveObjectTypeData>({
        collection: this.collectionTypes,
    });
    listClasses = new ListModel<IExplosiveObjectClass, IExplosiveObjectClassData>({
        collection: this.collectionClasses,
    });
    listClassesItems = new ListModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>({
        collection: this.collectionClassesItems,
    });
    list = new ListModel<IExplosiveObject, IExplosiveObjectData>(this);
    searchList = new ListModel<IExplosiveObject, IExplosiveObjectData>({
        collection: this.collection,
    });
    sum = new SumExplosiveObjectActions();

    treeClassesItems = new TreeModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>();

    constructor(params: { api: IApi; services: IServices }) {
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    get lists() {
        return {
            classItem: this.listClassesItems,
        };
    }

    get collections() {
        return {
            details: this.collectionDetails,
            group: this.collectionGroups,
            type: this.collectionTypes,
            class: this.collectionClasses,
            classItem: this.collectionClassesItems,
            country: this.collectionCountries,
        };
    }

    get sortedListTypes() {
        return this.listTypes.asArray.sort((a, b) =>
            a.data.name.localeCompare(b.data.name, ['uk'], {
                numeric: true,
                sensitivity: 'base',
            }),
        );
    }

    setSum(sum: IExplosiveObjectActionSumDTO) {
        this.sum.set(createExplosiveObjectActionSum(sum));
    }

    append(res: IExplosiveObjectDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchList : this.list;
        if (isSearch && !isMore) this.searchList.clear();

        list.checkMore(res.length);

        res.forEach((el) => {
            if (el.details) {
                const details = createExplosiveObjectDetails(el.id, el.details);
                this.collectionDetails.set(details.id, details);
            }
        });

        list.push(res.map(createExplosiveObject), true);
    }

    getClassesByGroupId(groupId: string, component: EXPLOSIVE_OBJECT_COMPONENT) {
        return this.listClasses.asArray.filter((el) => el.data.groupId === groupId && el.data.component === component);
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IExplosiveObjectDataParams>) => {
            const res = await this.api.explosiveObject.create(createExplosiveObjectDTO(data));

            const value = createExplosiveObject(res);

            if (res.details) {
                const details = createExplosiveObjectDetails(res.id, res.details);
                this.collectionDetails.set(details.id, details);
            }

            this.list.unshift(value);
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.explosiveObject.remove(id);
            this.list.removeById(id);
            this.searchList.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchList = new RequestModel({
        shouldRun: (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            return !(!isSearch && list.length);
        },
        run: async (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            const res = await this.api.explosiveObject.getList({
                search,
                limit: list.pageSize,
            });

            this.append(res, isSearch);
        },
    });

    fetchMoreList = new RequestModel({
        shouldRun: (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            return list.isMorePages;
        },
        run: async (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            const res = await this.api.explosiveObject.getList({
                limit: list.pageSize,
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });

            this.append(res, isSearch, true);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchSum = new RequestModel({
        run: async (startDate: Dayjs, endDate: Dayjs) => {
            const res = await this.api.explosiveObject.sum({
                where: {
                    executedAt: {
                        '>=': dates.toDateServer(startDate),
                        '<=': dates.toDateServer(endDate),
                    },
                },
            });

            this.setSum(res);
        },
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.explosiveObject.get(id);

            if (res.details) {
                const details = createExplosiveObjectDetails(res.id, res.details);
                this.collectionDetails.set(details.id, details);
            }

            this.collection.set(res.id, createExplosiveObject(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchDeeps = new RequestModel({
        run: async () => {
            const [types, classes, classesItems, countries, groups] = await Promise.all([
                this.api.explosiveObject.getTypesList(),
                this.api.explosiveObject.getClassesList(),
                this.api.explosiveObject.getClassesItemsList(),
                this.api.explosiveObject.getCountriesList(),
                this.api.explosiveObject.getGroupsList(),
            ]);

            this.listTypes.set(types.map(createExplosiveObjectType));
            this.listClasses.set(classes.map(createExplosiveObjectClass));
            this.listClassesItems.set(classesItems.map(createExplosiveObjectClassItem));
            this.listCountries.set(countries.map(createCountry));
            this.listGroups.set(groups.map(createExplosiveObjectGroup));

            this.treeClassesItems.set(data.buildTreeNodes<IExplosiveObjectClassItem>(this.listClassesItems.asArray));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
