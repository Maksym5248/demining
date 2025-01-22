export enum LogLevel {
    None = 0,
    Error = 1,
    Info = 2,
    Debug = 3,
}

export interface ILog {
    level: LogLevel;
    value: string;
    createAt?: Date;
}

export interface ILogger {
    logLevel: LogLevel;
    logs: ILog[];
    enable: () => void;
    disable: () => void;
    setLevel: (level: LogLevel) => void;
    error: (message?: any, ...optionalParams: any[]) => void;
    log: (message?: any, ...optionalParams: any[]) => void;
    debug: (message?: any, ...optionalParams: any[]) => void;
    onChange: (callBack: (value: ILog) => void) => () => void;
    removeAllListeners: () => void;
}
