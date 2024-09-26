import { type ICollectionModel } from './CollectionModel';

export interface ITreeNode<T extends { data: B }, B extends { id: string; parentId: string | null }> {
    id: string;
    children: ITreeNode<T, B>[];
    item?: T;
}

export interface ITree<T extends { data: B }, B extends { id: string; parentId: string | null }> {
    id: 'root';
    children: ITreeNode<T, B>[];
}

export interface TreeModelParams<T extends { data: B }, B extends { id: string; parentId: string | null }> {
    collection: ICollectionModel<T, B>;
}

export const TREE_ROOT_ID = 'root';

export interface ITreeModel<T extends { data: B }, B extends { id: string; parentId: string | null }> {
    tree: ITreeNode<T, B> | null;
    set(nodes: ITreeNode<T, B>[]): void;
    clear(): void;
    getNode(id: string): ITreeNode<T, B> | null;
    getNodeLowLevel(ids: string[]): ITreeNode<T, B> | null;
    findParent(id: string, node: ITreeNode<T, B>): ITreeNode<T, B> | null;
    getChilds(id: string): ITreeNode<T, B>[];
    getAllChilds(id: string): ITreeNode<T, B>[];
    getAllChildsIds(id: string): string[];
    getParent(id: string): ITreeNode<T, B> | null;
    getAllParents(id: string): ITreeNode<T, B>[];
    getAllParentsIds(id: string, excluderRoot?: boolean): string[];
}

export class TreeModel<T extends { data: B }, B extends { id: string; parentId: string | null }> implements ITreeModel<T, B> {
    tree: ITreeNode<T, B> | null = null;
    map: { [key: string]: ITreeNode<T, B> } = {};

    set(nodes: ITreeNode<T, B>[]) {
        this.tree = {
            id: TREE_ROOT_ID,
            children: [...nodes],
        };

        this.updateMap(this.tree.children);
    }

    updateMap = (nodes: ITreeNode<T, B>[]) => {
        if (!nodes) return;

        nodes.forEach((node) => {
            this.map[node.id] = node;
            this.updateMap(node.children);
        });
    };

    clear() {
        this.tree = null;
    }

    getNode(id: string): ITreeNode<T, B> | null {
        return this.map[id] || null;
    }

    getNodeLowLevel(ids: string[]): ITreeNode<T, B> | null {
        const arr = ids
            .map((id) => this?.getNode(id))
            .filter(Boolean)
            .filter((el) => !el?.children?.length);

        return arr[0] || null;
    }

    findParent = (id: string, node: ITreeNode<T, B>): ITreeNode<T, B> | null => {
        if (node.children.some((child) => child.id === id)) {
            return node;
        }

        return node.children.reduce((acc: ITreeNode<T, B> | null, child) => {
            if (acc) return acc;

            return this.findParent(id, child);
        }, null);
    };

    getChilds(id: string): ITreeNode<T, B>[] {
        if (!this.tree) return [];
        const node = this.getNode(id);
        return node ? node.children : [];
    }

    getAllChilds(id: string): ITreeNode<T, B>[] {
        const childs = this.getChilds(id);

        return childs.reduce(
            (acc, child) => {
                acc.push(child, ...this.getAllChilds(child.id));
                return acc;
            },
            [] as ITreeNode<T, B>[],
        );
    }

    getAllChildsIds(id: string): string[] {
        return this.getAllChilds(id).map((child) => child.id);
    }

    getParent(id: string): ITreeNode<T, B> | null {
        if (!this.tree) return null;

        return this.findParent(id, this.tree);
    }

    getAllParents(id: string): ITreeNode<T, B>[] {
        const parent = this.getParent(id);
        if (!parent) return [];
        return [parent, ...this.getAllParents(parent.id)];
    }

    getAllParentsIds(id: string, excluderRoot?: boolean): string[] {
        return this.getAllParents(id)
            .map((parent) => parent.id)
            .filter((id) => !excluderRoot || id !== TREE_ROOT_ID);
    }
}
