interface IAppData {
    appDataPath: string
}

class PlatformClass {
	appData:IAppData = {
		appDataPath: ""
	};

	async init() {
		this.appData = await window.electronAPI?.getAppData();

	}

	get appDataPath(){
		return this.appData.appDataPath
	}
}

export const Platform = new PlatformClass();
