import * as Controllers from "./controllers"

export * from "./types"


const init = async () => {
    await Api.explosiveObjectType.init();
    await Api.explosiveObject.init();
}

export const Api = {
    ...Controllers,
    init
}