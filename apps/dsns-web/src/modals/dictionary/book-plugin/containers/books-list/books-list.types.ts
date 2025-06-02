import { type IBook } from 'shared-my-client';

export interface IBooksListProps {
    onOpenBook: (id: string) => void;
}

export interface IBooksListItemProps {
    onOpenBook: (id: string) => void;
    item: IBook;
}
