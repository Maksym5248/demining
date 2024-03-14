import { ASSET_TYPE, ASSET_DIR } from "~/constants";

import { AssetStorageBase } from "./asset-base";

class AssetStorageClass {
	document = new AssetStorageBase(ASSET_TYPE.DOCUMENT);

	setOrganizationId(organizationId:string){
		const rootCollection = `${ASSET_DIR.ORGANIZATION_DATA}/${organizationId}`;
		
		this.document.setRootCollect(rootCollection);
	}

	removeOrganizationId(){
		this.document.removeRootCollect();
	}
}

export const AssetStorage = new AssetStorageClass()