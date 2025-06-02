import { type IBook } from 'shared-my-client';

export interface IBooksPdfAssetsProps {
    onOpenBook: (id: string) => void;
    item: IBook;
}
