import EventEmitter from 'events';

import { LogLevel, type ILogger, type ILog } from './types';

const eventEmitter = new EventEmitter();

enum EVENTS {
    ON_CHANGE = 'ON_CHANGE',
}

export class Logger implements ILogger {
    logLevel: LogLevel;

    logs: ILog[];

    constructor(private isDebug: boolean = false) {
        this.logLevel = LogLevel.None;
        this.logs = [];
    }

    private _save(level: LogLevel, value: string) {
        const log = { level, value, createAt: new Date() };
        this.logs.push(log);
        eventEmitter.emit(EVENTS.ON_CHANGE, log);
    }

    enable = () => {
        this.isDebug = true;
    };

    disable = () => {
        this.isDebug = false;
    };

    getLogs() {
        return [...this.logs];
    }

    setLevel = (level: LogLevel) => {
        this.logLevel = level;
    };

    error = (message?: any, ...optionalParams: any[]) => {
        if (this.logLevel >= LogLevel.Error) {
            const msg = `ERROR: ${message?.message ?? message} ${optionalParams?.join(',')}`;
            this.isDebug && console.log(`ERROR:`, message, optionalParams);
            this._save(LogLevel.Error, msg);
        }
    };

    log = (message?: any, ...optionalParams: any[]) => {
        if (this.logLevel >= LogLevel.Info) {
            const msg = `LOG: ${message} ${optionalParams?.join(',')}`;
            this.isDebug && console.log(msg);
            this._save(LogLevel.Info, msg);
        }
    };

    debug = (message?: any, ...optionalParams: any[]) => {
        if (this.logLevel >= LogLevel.Debug) {
            const msg = `DEBUG: ${message} ${optionalParams?.join(',')}`;
            this.isDebug && console.log(msg);
            this._save(LogLevel.Debug, msg);
        }
    };

    onChange = (callBack: (value: ILog) => void) => {
        eventEmitter.on(EVENTS.ON_CHANGE, callBack);

        return () => eventEmitter.removeListener(EVENTS.ON_CHANGE, callBack);
    };

    removeAllListeners() {
        eventEmitter.removeAllListeners();
    }
}
