import { type IModalView } from 'shared-my-client';

import { type IBookFilter } from '~/types';

export interface IFilterBooksProps extends IModalView {
    filters?: IBookFilter;
    onSelect?: (filter: IBookFilter) => void;
}
