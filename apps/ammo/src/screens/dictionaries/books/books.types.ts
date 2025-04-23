import { type IBookFilter } from '~/types';

export interface IBookScreenProps {
    route?: {
        params?: {
            filters?: IBookFilter;
            autoFocus?: boolean;
        };
    };
}
