import * as Controllers from "./controllers"

export * from "./types"


const init = async () => {
	await Controllers.explosiveObjectType.init();
	await Controllers.explosiveObject.init();
}

export const Api = {
	...Controllers,
	init
}