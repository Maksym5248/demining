import { type IModalView } from 'shared-my-client';

import { type IOption } from '~/types';

export interface ISelectModalProps extends IModalView {
    value: string | string[];
    options: IOption<unknown>[];
    onSelect: (value: IOption<unknown> | IOption<unknown>[]) => void;
    title: string;
    isMulti?: boolean;
}
