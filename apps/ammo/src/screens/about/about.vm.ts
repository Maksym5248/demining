import { makeAutoObservable } from 'mobx';

import { CONFIG } from '~/config';
import { type ViewModel } from '~/types';

export interface IAboutVM extends ViewModel {
    asArray: { title: string; text?: string; email?: string }[];
}

export class AboutVM implements IAboutVM {
    constructor() {
        makeAutoObservable(this);
    }

    get asArray() {
        return [
            {
                title: 'title1',
                text: 'text1',
            },
            {
                title: 'title2',
                text: 'text2',
            },
            {
                title: 'title3',
                email: CONFIG.SUPPORT_EMAIL,
            },
        ];
    }
}

export const aboutVM = new AboutVM();
