import { ASSET_DIR, ASSET_TYPE } from 'shared-my/db';
import { type IAssetStorage } from 'shared-my-client/services';

import { AssetStorageBase } from './asset-base';

export class AssetStorageClass implements IAssetStorage {
    document = new AssetStorageBase(ASSET_TYPE.DOCUMENT);

    setOrganizationId(organizationId: string) {
        const rootCollection = `${ASSET_DIR.ORGANIZATION_DATA}/${organizationId}`;

        this.document.setRootCollect(rootCollection);
    }

    removeOrganizationId() {
        this.document.removeRootCollect();
    }
}
