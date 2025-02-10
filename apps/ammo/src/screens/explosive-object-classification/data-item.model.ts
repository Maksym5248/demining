import { makeAutoObservable } from 'mobx';
import { TypeNodeClassification, type INode } from 'shared-my-client';

import { SCREENS } from '~/constants';
import { Navigation } from '~/services';

export interface IDataItem {
    id: string;
    displayName: string;
    deep: number;
    isDeepLast: boolean;
    isRootLast: boolean;
    isNextLastRoot: boolean;
    openItem(): void;
}

export class DataItem implements IDataItem {
    constructor(
        public node: INode,
        public isDeepLast: boolean,
        public isRootLast: boolean,
        public isNextLastRoot: boolean,
    ) {
        makeAutoObservable(this);
    }

    openItem() {
        Navigation.navigate(SCREENS.SEARCH, {
            filters: {
                classItemIds: [this.node.id],
            },
        });
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
        if (this.isClass) return (this.node.deep ?? 0) + 1;
        if (this.isClassItem) return (this.node.deep ?? 0) + 2;

        return (this.node.deep ?? 0) + 1;
    }
}
