// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld('electronAPI', {
	getAppData: () => ipcRenderer.invoke('app-data'),
	path: {
		join: (...args: any[]) => ipcRenderer.invoke('path-join', args)
	},
	fs: {
		existsSync: (...args: any[]) => ipcRenderer.invoke('fs-existsSync', args),
		mkdirSync: (...args: any[]) => ipcRenderer.invoke('fs-mkdirSync', args),
		writeFile: (...args: any[]) => ipcRenderer.invoke('fs-writeFile', args),
		readFile: (...args: any[]) => ipcRenderer.invoke('fs-readFile', args),
		unlink: (...args: any[]) => ipcRenderer.invoke('fs-unlink', args),
	}
});
