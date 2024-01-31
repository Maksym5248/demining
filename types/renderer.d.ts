export interface IElectronAPI {
  getAppData: () => Promise<{
     appDataPath:string
  }>
}
  

declare global {
  interface Window {
      electronAPI: IElectronAPI
  }
}