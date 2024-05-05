export interface IElectronAPI {
  getAppData: () => Promise<{
     appDataPath:string
  }>
  path: {
    join: (str1:string, str2:string) => Promise<string>
  },
  fs: {
    existsSync: (str1:string) => Promise<boolean>;
    mkdirSync: (str1:string) => Promise<boolean | undefined>;
    writeFile: (str1:string, buffer: Buffer) => Promise<void>;
    readFile: (str1:string) => Promise<Buffer>;
    unlink: (str1:string) => Promise<void>;
  }
}
  

declare global {
  interface Window {
      electronAPI: IElectronAPI
  }
}