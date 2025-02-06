import { type IModalView } from 'shared-my-client';

export interface IGalleryProps extends IModalView {
    images: { uri: string }[];
    index?: number;
}
