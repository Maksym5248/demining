import { uniq } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { APPROVE_STATUS, EXPLOSIVE_OBJECT_TYPE } from 'shared-my';

import { type IExplosiveObjectAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type ICollectionModel, type IDataModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';
import { type ICountry, type ICountryData } from '~/stores/common';
import { type IViewerStore } from '~/stores/viewer';

import {
    type IExplosiveObjectDataParams,
    type IExplosiveObjectData,
    updateExplosiveObjectDTO,
    createExplosiveObject,
} from './explosive-object.schema';
import { type INode, type IClassifications } from '../../classifications';
import { type IExplosiveObjectClass, type IExplosiveObjectClassData } from '../explosive-object-class';
import { type IExplosiveObjectClassItemData, type IExplosiveObjectClassItem } from '../explosive-object-class-item';
import { type IExplosiveObjectComponent, type IExplosiveObjectComponentData } from '../explosive-object-component';
import { createExplosiveObjectDetails, type IExplosiveObjectDetails, type IExplosiveObjectDetailsData } from '../explosive-object-details';
import { type IExplosiveObjectType, type IExplosiveObjectTypeData } from '../explosive-object-type';

interface IApi {
    explosiveObject: IExplosiveObjectAPI;
}

interface IServices {
    message: IMessage;
}

interface ICollections {
    type: ICollectionModel<IExplosiveObjectType, IExplosiveObjectTypeData>;
    class: ICollectionModel<IExplosiveObjectClass, IExplosiveObjectClassData>;
    classItem: ICollectionModel<IExplosiveObjectClassItem, IExplosiveObjectClassItemData>;
    country: ICollectionModel<ICountry, ICountryData>;
    details: ICollectionModel<IExplosiveObjectDetails, IExplosiveObjectDetailsData>;
    component: ICollectionModel<IExplosiveObjectComponent, IExplosiveObjectComponentData>;
}

interface IStores {
    viewer?: IViewerStore;
}

interface IExplosiveObjectParams {
    collections: ICollections;
    api: IApi;
    services: IServices;
    getStores: () => IStores;
    classifications: IClassifications;
}

export interface IExplosiveObject extends IDataModel<IExplosiveObjectData> {
    imageUri?: string | null;
    displayName: string;
    signName: string;
    type?: IExplosiveObjectType;
    component?: IExplosiveObjectComponentData;
    details?: IExplosiveObjectDetails;
    country?: ICountry;
    isConfirmed: boolean;
    isPending: boolean;
    isCurrentOrganization: boolean;
    isEditable: boolean;
    isRemovable: boolean;
    update: RequestModel<[IUpdateValue<IExplosiveObjectData>]>;
    classItemsNames: string[];
    classItemIds: string[];
    sortedByClass: {
        id: string;
        name: string;
        items: string[];
    }[];
}

export class ExplosiveObject implements IExplosiveObject {
    api: IApi;
    services: IServices;
    collections: ICollections;
    classifications: IClassifications;

    getStores: () => IStores;
    data: IExplosiveObjectData;

    constructor(data: IExplosiveObjectData, { collections, api, services, getStores, classifications }: IExplosiveObjectParams) {
        this.data = data;

        this.collections = collections;
        this.api = api;
        this.services = services;
        this.getStores = getStores;
        this.classifications = classifications;

        makeAutoObservable(this);
    }

    updateFields(data: IUpdateValue<IExplosiveObjectDataParams>) {
        Object.assign(this.data, data);
    }

    get component() {
        return this.collections.component.get(this.data.component)?.data;
    }

    get details() {
        return this.collections.details.get(this.data.id);
    }

    get id() {
        return this.data.id;
    }

    get type() {
        return this.collections.type.get(this.data.typeId);
    }

    get country() {
        return this.collections.country.get(this.data.countryId);
    }

    get displayName() {
        if (
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.ARTELERY_SHELL ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.UAM ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.MLRS ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.MORTAL_MINES ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.AMMO
        ) {
            return `${this?.data?.name}${this?.data?.name ? ' ' : ''}${this.type?.data.name}-${this.details?.data.caliber}мм`;
        }

        if (this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.AVIATION_BOMBS) {
            return `${this?.data.name}-${this.details?.data.caliber}`;
        }

        return String(this.data.name);
    }

    get imageUri() {
        return this?.data.imageUri ?? '';
    }

    get signName() {
        if (
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.ARTELERY_SHELL ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.UAM ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.MLRS ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.MORTAL_MINES ||
            this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.AMMO
        ) {
            return `${this.type?.data.name}-${this.details?.data.caliber}мм`;
        }

        if (this.type?.data.id === EXPLOSIVE_OBJECT_TYPE.AVIATION_BOMBS) {
            return `${this?.data.name}-${this.details?.data.caliber}`;
        }

        if (EXPLOSIVE_OBJECT_TYPE.RG || EXPLOSIVE_OBJECT_TYPE.ENGINEERING) {
            return String(this.type?.data.name);
        }

        return String(this.data.name);
    }

    get isConfirmed() {
        return this.data.status === APPROVE_STATUS.CONFIRMED;
    }

    get isPending() {
        return this.data.status === APPROVE_STATUS.PENDING;
    }

    get isCurrentOrganization() {
        return this.data.organizationId === this.getStores()?.viewer?.user?.data.organization?.id;
    }

    get isEditable() {
        const { permissions } = this.getStores()?.viewer ?? {};
        return !!permissions?.dictionary?.edit(this.data);
    }

    get isRemovable() {
        const { permissions } = this.getStores()?.viewer ?? {};
        return !!permissions?.dictionary?.remove(this.data);
    }

    get classItemIds() {
        const arr =
            this?.data.classItemIds?.map(id => {
                const item = this.classifications.get(id);
                const parentsIds = item.parents?.map(parent => parent.item.id);
                return [...parentsIds, item.item.id];
            }) ?? [];

        const merged =
            arr?.reduce((acc: string[], c: string[]) => {
                acc.push(...c);
                return acc;
            }, [] as string[]) ?? [];

        return uniq(merged);
    }

    get sortedByClass() {
        const items = this.classItemIds.map(id => this.collections.classItem.get(id));
        const sorted: Record<string, string[]> = {};

        items.forEach(item => {
            const classification = this.collections.class.get(item?.classId);

            if (!classification?.id || !item?.id) {
                return;
            }

            if (sorted[classification?.id]) {
                sorted[classification?.id].push(item?.displayName);
            } else {
                sorted[classification?.id] = [item?.displayName];
            }
        });

        const keys = Object.keys(sorted);

        return keys.map(key => {
            const classification = this.collections.class.get(key);

            return {
                id: classification?.id ?? '',
                name: classification?.displayName ?? '',
                items: sorted[key],
            };
        });
    }

    get classItemsNames() {
        const classification = this?.classItemIds?.map(id => this.classifications.get(id));

        return classification?.map((item: INode) => item.displayName) ?? [];
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<IExplosiveObjectDataParams>) => {
            const res = await this.api.explosiveObject.update(
                this.data.id,
                updateExplosiveObjectDTO({ ...this.data, details: this.details?.data, ...data }),
            );

            this.updateFields(createExplosiveObject(res));

            if (res.details) {
                const details = createExplosiveObjectDetails(res.id, res.details);
                this.collections.details.set(details.id, details);
            }
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
