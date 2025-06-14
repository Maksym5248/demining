import { type FlatListProps } from 'react-native';

export interface IFlatListRenderedItem<T> {
    item: T;
    index: number;
}

export interface IFlatListProps<T> extends FlatListProps<T> {
    isLoading?: boolean;
    isLoadingMore?: boolean;
    isSearch?: boolean;
    isEndReached?: boolean;
    separator?: number;
    isAnimated?: boolean;
}
