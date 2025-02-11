import { type DictionaryType } from '~/types';

export interface ISearchFilter {
    type?: DictionaryType;
    classItemIds: string[];
}

export interface ISearchScreenProps {
    route?: {
        params?: ISearchFilter;
    };
}
