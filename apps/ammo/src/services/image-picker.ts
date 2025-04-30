import ImagePicker, { type Image } from 'react-native-image-crop-picker';
import { ERROR_MESSAGE } from 'shared-my';

import { PERMISSIONS } from '~/constants';

import { type IPermissions } from './permissions/permissions';

export interface IImagePicker {
    selectImage: () => Promise<Image>;
}

export class ImagePickerClass implements IImagePicker {
    constructor(private permissions: IPermissions) {}

    selectImage = async () => {
        const isGranted = await this.permissions.ask(PERMISSIONS.PHOTO_LIBRARY);

        if (!isGranted) {
            throw new Error(ERROR_MESSAGE.PERMISSIONS_NOT_GRANTED);
        }

        const res = await ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
            mediaType: 'photo',
        });

        return res;
    };
}
