import path from 'path';

import { app, ipcMain } from 'electron';

import { CONFIG } from './config';

function getAppDataPath() {
	switch (process.platform) {
	  case "darwin":
		return path.join(app.getPath('home'), "Library", "Application Support", CONFIG.APP_NAME);
	  case "win32":
		return path.join(app.getPath('appData'), CONFIG.APP_NAME);
	  case "linux":
		return path.join(app.getPath('home'), `.${CONFIG.APP_NAME}`);
	  default: {
		console.log("Unsupported platform!");
		return ""
	  }
	}
}
  

export const expose = () => {
	ipcMain.handle('app-data', () => ({
		appDataPath: getAppDataPath()
	}));
}