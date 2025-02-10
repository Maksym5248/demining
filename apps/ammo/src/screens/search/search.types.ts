export interface ISearchFilter {
    classItemIds: string[];
}

export interface ISearchScreenProps {
    route?: {
        params?: ISearchFilter;
    };
}
