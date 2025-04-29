import ImagePicker, { type Image } from 'react-native-image-crop-picker';

export interface IImagePicker {
    selectImage: () => Promise<Image>;
}

export class ImagePickerClass implements IImagePicker {
    selectImage = async () => {
        const res = await ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
            mediaType: 'photo',
        });

        return res;
    };
}
