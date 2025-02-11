import { makeAutoObservable } from 'mobx';
import { TypeNodeClassification, type INode, type IClassNode, type ISectionNode } from 'shared-my-client';

import { SCREENS } from '~/constants';
import { Navigation } from '~/services';
import { DictionaryType } from '~/types';

export interface ITree {
    id: string;
    node: IDataItem | null;
    children: ITree[];
}

export interface IDataItemDeepLine {
    isLast: boolean;
    isVisible: boolean;
}

export interface IDataItem {
    id: string;
    displayName: string;
    deep: number;
    lines: IDataItemDeepLine[];
    isClassItem: boolean;
    isSection: boolean;
    isClass: boolean;
    setSectionVisible(value: boolean): void;
    setClassVisible(value: boolean): void;
    openItem(): void;
}

export class DataItem implements IDataItem {
    isSectionVisible = false;
    isClassVisible = false;
    isClassLast = false;
    isChildrenVisible = true;

    // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents, @typescript-eslint/no-redundant-type-constituents
    constructor(public node: ISectionNode | IClassNode | INode) {
        makeAutoObservable(this);
    }

    openItem() {
        if (!this.isClassItem) return;

        Navigation.navigate(SCREENS.SEARCH, {
            filters: {
                classItemIds: [this.node.id],
                type: DictionaryType.ExplosiveObject,
            },
        });
    }

    setClassLast(value: boolean) {
        this.isClassLast = value;
    }

    setSectionVisible(value: boolean) {
        this.isSectionVisible = value;
    }

    setClassVisible(value: boolean) {
        this.isClassVisible = value;
    }

    get isLast() {
        return false;
    }

    get id() {
        return this.node.id;
    }

    get displayName() {
        return this.node.displayName;
    }

    get isSection() {
        return this.node.type === TypeNodeClassification.Section;
    }

    get isClass() {
        return this.node.type === TypeNodeClassification.Class;
    }

    get isClassItem() {
        return this.node.type === TypeNodeClassification.ClassItem;
    }

    get deep() {
        if (this.isSection) return 0;
        if (this.isClass) return 1;
        if (this.isClassItem) return (this.node.deep ?? 0) + 2;

        return (this.node.deep ?? 0) + 1;
    }

    get lines() {
        const lines = new Array(this.deep);
        const lastIndex = lines.length - 1;

        return new Array(this.deep).fill(0).map((_, index) => {
            const isLast = index === lastIndex && !!this.node.isLast;
            const isVisibleSection = index === 0 && !this.isSectionVisible;
            const isVisibleClass = index === 1 && !this.isClassVisible;
            const isClassLast = index === 1 && !!this.isClassLast;

            return {
                isLast: isLast || isClassLast,
                isVisible: index > 1 || isVisibleSection || isVisibleClass,
            };
        });
    }
}
