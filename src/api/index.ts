import * as controllers from "./controllers";

export * from "./external";

export * from "./types"


const createExplosiveObjectsTypes = async () => {
	await controllers.explosiveObjectType.init();
}

const createExplosiveObjects = async () => {
	await controllers.explosiveObject.init();
}

export const Api = {
	...controllers,
	createExplosiveObjectsTypes,
	createExplosiveObjects
}