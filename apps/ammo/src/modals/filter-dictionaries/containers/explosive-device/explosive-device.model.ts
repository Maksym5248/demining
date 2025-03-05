import { makeAutoObservable } from 'mobx';
import { type EXPLOSIVE_DEVICE_TYPE, explosiveDeviceTypeData } from 'shared-my';

import { MODALS } from '~/constants';
import { Modal } from '~/services';
import { type IDictionatyFilterExplosviveDevice, type IOption } from '~/types';

export interface IExplosiveDeviceModel {
    openTypeSelect(): void;
    setFilters(filters?: IDictionatyFilterExplosviveDevice): void;
    filters: IDictionatyFilterExplosviveDevice;
    type?: IOption<string>;
    removeType: () => void;
    clear: () => void;
}

export class ExplosiveDeviceModel implements IExplosiveDeviceModel {
    filters: IDictionatyFilterExplosviveDevice = {
        type: undefined,
    };

    constructor() {
        makeAutoObservable(this);
    }

    clear() {
        this.filters = {
            type: undefined,
        };
    }

    get typeOptions(): IOption<string>[] {
        return explosiveDeviceTypeData.map(type => ({
            value: type.id,
            title: type.name,
        }));
    }

    get type() {
        const type = explosiveDeviceTypeData.find(type => type.id === this.filters.type);

        return type
            ? {
                  value: type.id,
                  title: type.name,
              }
            : undefined;
    }

    removeType() {
        this.setFilters({ type: undefined });
    }

    setFilters(filters?: Partial<IDictionatyFilterExplosviveDevice>) {
        filters && Object.assign(this.filters, filters);
    }

    openTypeSelect() {
        const onSelect = (option: IOption<EXPLOSIVE_DEVICE_TYPE>[]) => {
            this.setFilters({
                type: option.some(el => el.value === this.filters.type) ? undefined : option[0]?.value,
            });
        };

        Modal.show(MODALS.SELECT, {
            value: this.filters.type,
            options: this.typeOptions,
            onSelect,
        });
    }
}
