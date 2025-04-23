import { type IDictionatyFilter } from '~/types';

export interface IDictionariesScreenProps {
    route?: {
        params?: {
            filters?: IDictionatyFilter;
            autoFocus?: boolean;
        };
    };
}
