import { type IDocumentDB } from '../types';

export interface IMarking {
    name: string;
}

export interface IStructure {
    description: string;
    imageIds: IDocumentDB[];
}

export interface INeutralization {
    description: string;
}

export interface IAction {
    description: string;
    imageIds: string[];
}
