import uuid from 'uuid';

import { type IAssetStorage } from '~/services';

export const createImage = async ({
    image,
    services,
}: {
    image?: File;
    services: {
        assetStorage: IAssetStorage;
    };
}): Promise<string | null> => {
    let imageUri = null;

    if (image) {
        const id = uuid();
        await services.assetStorage.image.save(id, image);
        imageUri = await services.assetStorage.image.getFileUrl(id);
    }

    return imageUri;
};

export const updateImage = async ({
    image,
    imageUri,
    services,
}: {
    image?: File;
    imageUri: string | null;
    services: {
        assetStorage: IAssetStorage;
    };
}): Promise<string | null> => {
    const imageUriInternal = imageUri;

    if (image) {
        const id = uuid();
        await services.assetStorage.image.save(id, image);
        imageUri = await services.assetStorage.image.getFileUrl(id);
    }

    return imageUriInternal;
};
