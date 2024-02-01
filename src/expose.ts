import path from 'path';
import fs from 'fs';

import { IpcMainInvokeEvent, app, ipcMain } from 'electron';

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
	ipcMain.handle('path-join', (event: IpcMainInvokeEvent, args: string[]) => {
		const [str1, str2] = args;
		return path.join(str1, str2)
	});
	ipcMain.handle('fs-existsSync', (event: IpcMainInvokeEvent, args: string[]) => {
		const [str1] = args;
		return fs.existsSync(str1)
	});
	ipcMain.handle('fs-mkdirSync', (event: IpcMainInvokeEvent, args: string[]) => {
		const [str1] = args;
		return fs.mkdirSync(str1)
	});
	ipcMain.handle('fs-writeFile', (event: IpcMainInvokeEvent, args: [string, Buffer]) => {
		const [str1, buffer] = args;
		return fs.promises.writeFile(str1, buffer)
	});
	ipcMain.handle('fs-readFile', (event: IpcMainInvokeEvent, args: string[]) => {
		const [str1] = args;
		return fs.promises.readFile(str1)
	});
	ipcMain.handle('fs-unlink', (event: IpcMainInvokeEvent, args: string[]) => {
		const [str1] = args;
		return fs.promises.unlink(str1)
	});
}