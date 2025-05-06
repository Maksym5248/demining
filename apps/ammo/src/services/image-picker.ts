import { type Image, openPicker } from 'react-native-image-crop-picker';
import { ERROR_MESSAGE } from 'shared-my';

import { PERMISSIONS } from '~/constants';

import { type IPermissions } from './permissions';

interface Params {
    multiple?: boolean;
}

export type IGalleryImage = Image;
export type PossibleArray<O, T> = O extends { multiple: true } ? T[] : T;

export interface IImagePicker {
    selectImage: <P extends Params>(params?: P) => Promise<PossibleArray<P, Image>>;
}

export class ImagePickerClass implements IImagePicker {
    constructor(private permissions: IPermissions) {}

    selectImage = async <P extends Params>(params?: P) => {
        const isGranted = await this.permissions.ask(PERMISSIONS.PHOTO_LIBRARY);

        if (!isGranted) {
            throw new Error(ERROR_MESSAGE.PERMISSIONS_NOT_GRANTED);
        }

        try {
            const res = await openPicker({
                width: 1200,
                height: 1200,
                cropping: true,
                mediaType: 'photo',
                multiple: !!params?.multiple,
            });

            return res as PossibleArray<P, Image>;
        } catch (error) {
            if ((error as Error)?.message === 'User cancelled image selection') {
                throw new Error(ERROR_MESSAGE.CANCELED);
            }

            throw error;
        }
    };
}
