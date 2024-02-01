// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { ipcRenderer } from 'electron';


window.electronAPI = {
	getAppData: () => ipcRenderer.invoke('app-data'),
	path: {
		join: (...args) => ipcRenderer.invoke('path-join', args)
	},
	fs: {
		existsSync: (...args) => ipcRenderer.invoke('fs-existsSync', args),
		mkdirSync: (...args) => ipcRenderer.invoke('fs-mkdirSync', args),
		writeFile: (...args) => ipcRenderer.invoke('fs-writeFile', args),
		readFile: (...args) => ipcRenderer.invoke('fs-readFile', args),
		unlink: (...args) => ipcRenderer.invoke('fs-unlink', args),
	}
}