import { makeAutoObservable } from 'mobx';

import { type ISlide } from '~/types';

export interface ISectionCarouselModel {
    description?: string;
    data: ISlide[];
    isVisible: boolean;
}

export class SectionCarouselModel implements ISectionCarouselModel {
    constructor(
        public data: ISlide[],
        public description?: string,
    ) {
        this.data = [];

        makeAutoObservable(this);
    }

    get isVisible() {
        return !!this.data.length || !!this.description;
    }
}
