import { makeAutoObservable } from 'mobx';

import { stores } from '~/stores';
import { type ViewModel } from '~/types';

import { DataItem, type IDataItem } from './data-item.model';

export interface IExplosiveObjectClassificationVM extends ViewModel {
    asArray: IDataItem[];
}

export class ExplosiveObjectClassificationVM implements IExplosiveObjectClassificationVM {
    typeId = '';

    constructor() {
        makeAutoObservable(this);
    }

    init({ typeId }: { typeId: string }) {
        typeId && (this.typeId = typeId);
    }

    unmount() {
        this.typeId = '';
    }

    get asArray() {
        const sections = stores.explosiveObject.classifications.getSections(this.typeId);
        const data: IDataItem[] = [];

        sections.forEach(section => {
            data.push(new DataItem(section, this.typeId));

            section?.children?.forEach(classification => {
                data.push(new DataItem(classification, this.typeId));
                const lastIndex = classification?.children?.findLastIndex(node => node.deep === 0) ?? -1;

                classification?.children?.forEach((node, i) => {
                    const item = new DataItem(node, this.typeId);
                    item.setSectionVisible(classification.isLast);
                    item.setClassVisible(i > lastIndex);
                    item.setClassLast(i === lastIndex);
                    data.push(item);
                });
            });
        });

        return data;
    }
}

export const explosiveObjectClassificationVM = new ExplosiveObjectClassificationVM();
