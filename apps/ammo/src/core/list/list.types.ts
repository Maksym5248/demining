import { type FlatList } from 'react-native-gesture-handler';

export interface IFlatListProps<T extends { id: string }> extends FlatList<T> {
    data: T[];
    renderItem: (props: { item: T; index: number }) => JSX.Element;
}
