import { type IDictionatyFilter } from '~/types';

export interface ISearchScreenProps {
    route?: {
        params?: {
            filters?: IDictionatyFilter;
            autoFocus?: boolean;
        };
    };
}
