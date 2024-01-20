import * as controllers from "./controllers";

export * from "./external";

export * from "./types"


const init = async () => {
	await controllers.explosiveObjectType.init();
	await controllers.explosiveObject.init();
}

export const Api = {
	...controllers,
	init
}