import { ASSET_DIR, ASSET_TYPE } from 'shared-my';
import { type IAssetStorage } from 'shared-my-client';

import { AssetStorageBase } from './asset-base';

export class AssetStorageClass implements IAssetStorage {
    document = new AssetStorageBase(ASSET_TYPE.DOCUMENT);

    image = new AssetStorageBase(ASSET_TYPE.IMAGE);

    book = new AssetStorageBase(ASSET_TYPE.BOOK);

    setOrganizationId(organizationId: string) {
        const rootCollection = `${ASSET_DIR.ORGANIZATION_DATA}/${organizationId}`;

        this.document.setRootCollect(rootCollection);
    }

    removeOrganizationId() {
        this.document.removeRootCollect();
    }
}
