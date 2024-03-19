import * as controllers from "./controllers";

export * from "./external";

export * from "./types"


const createExplosiveObjects = async () => {
	await controllers.explosiveObject.init();
}

export const Api = {
	...controllers,
	createExplosiveObjects
}