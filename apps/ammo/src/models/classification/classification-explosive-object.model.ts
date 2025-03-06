import { makeAutoObservable } from 'mobx';
import { isArray, type EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { stores } from '~/stores';

import { ClassificationItem, type IClassificationItem } from './classfication-item.model';

export interface IClassificationExplosiveObject {
    setType(typeId: string): void;
    setComponent(components?: EXPLOSIVE_OBJECT_COMPONENT | EXPLOSIVE_OBJECT_COMPONENT[]): void;
    clearType(): void;
    get(classItemId?: string): IClassificationItem | undefined;
    asArray: IClassificationItem[];
}

export class ClassificationExplosiveObject implements IClassificationExplosiveObject {
    typeId = '';
    values: EXPLOSIVE_OBJECT_COMPONENT[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setType(typeId: string) {
        typeId && (this.typeId = typeId);
    }

    setComponent(components?: EXPLOSIVE_OBJECT_COMPONENT | EXPLOSIVE_OBJECT_COMPONENT[]) {
        if (components) {
            this.values = isArray(components) ? components : [components];
        } else {
            this.values = [];
        }
    }

    clearType() {
        this.typeId = '';
    }

    get(classItemId: string) {
        return this.asArray.find(item => item.id === classItemId);
    }

    get sections() {
        return stores.explosiveObject.classifications.getSections(this.typeId);
    }

    get asArray() {
        const data: IClassificationItem[] = [];

        this.sections.forEach(section => {
            data.push(new ClassificationItem(section, this.typeId));

            section?.children?.forEach(classification => {
                data.push(new ClassificationItem(classification, this.typeId));
                const lastIndex = classification?.children?.findLastIndex(node => node.deep === 0) ?? -1;

                classification?.children?.forEach((node, i) => {
                    const item = new ClassificationItem(node, this.typeId);
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
